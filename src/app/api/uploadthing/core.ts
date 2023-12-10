import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing(); 

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
		// make sure authenticated users can use this
		.middleware(async ({ req }) => {

			const { getUser } = getKindeServerSession();
			const user = getUser();

			if(!user || !user.id) throw new Error("unauthorized");

      return {
				userId: user.id
			}
    })
    .onUploadComplete(async ({ metadata, file }) => {
			const createdFile = await db.file.create({
				data: {
					key: file.key,
					name: file.name,
					userId: metadata.userId,
					url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
					uploadStatus: "PROCESSING"
				}
			})
		}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;