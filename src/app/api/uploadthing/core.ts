import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { PDFLoader } from "langchain/document_loaders/fs/pdf" 
import { pinecone } from "@/lib/validators/pinecone";
import { PineconeStore } from 'langchain/vectorstores/pinecone';

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
					uploadStatus: 'PROCESSING',
				},
			})

			try {
				const response = await fetch(`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`)
				const blob = await response.blob()

				const loader = new PDFLoader(blob)

				const pageLevelDocs = await loader.load()
				const pagesAmt = pageLevelDocs.length

				// vectorize and index entire document

				const pineconeIndex = pinecone.Index("kwin")

				const embeddings = new OpenAIEmbeddings({
					openAIApiKey: process.env.OPENAI_API_KEY
				})

				await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
					pineconeIndex,
					namespace: createdFile.id
				})

				await db.file.update({
					data: {
						uploadStatus: "SUCCESS"
					},
					where: {
						id: createdFile.id
					}
				})

			} catch (error) {
				await db.file.update({
					data: {
						uploadStatus: "FAILED"
					},
					where: {
						id: createdFile.id
					}	
				})
			}
		}),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
