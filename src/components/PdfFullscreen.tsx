import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Expand, Loader2 } from "lucide-react"
import SimpleBar from "simplebar-react"
import { Document, Page } from 'react-pdf';
import { useToast } from "./ui/use-toast"
import { useResizeDetector } from "react-resize-detector"

interface PdfFullScreenProps {
	fileUrl: string;
}

export const PdfFullscreen = ({fileUrl}: PdfFullScreenProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [numPages, setNumPages] = useState<number>()
	
	const { toast } = useToast()
	const { width, ref } = useResizeDetector()

	return (
		<Dialog open={ isOpen } onOpenChange={(v) => {
			if(!v) setIsOpen(v);
		}}>
			<DialogTrigger 
				asChild
					onClick={() => setIsOpen(true)}
			>
				<Button
					variant="ghost" 
					className="gap-1.5" 
					aria-label="fullscreen"
				>
					<Expand className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-7xl w-full">
				<SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
					<div ref={ref}>
						<Document 
							file={fileUrl} 
							className="max-h-full"
							loading={
								<div className="flex justify-center">
									<Loader2 className="my-24 h-6 w-6 animate-spin" />
								</div>
							}
							onLoadSuccess={({numPages})=> setNumPages(numPages)}
							onLoadError={() => {
								toast({
									title: "error",
									description: "Please try again later",
									variant: "destructive"
								})
							}}
						>
							{
								new Array(numPages).fill(0).map((_, i) => (
									<Page
										key={i}
										width={width ? width : 1}
										pageNumber={i + 1}
									/>
								))
							}
						</Document>
					</div>
				</SimpleBar>
			</DialogContent>
		</Dialog>
	)
}
