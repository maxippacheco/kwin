import { trpc } from "@/app/_trpc/client"
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query"

interface MessagesProps { 
	fileId: string
}

export const Messages = ({ fileId }: MessagesProps) => {

	const { } = trpc.getFileMessages.useInfiniteQuery({
		fileId,
		limit: INFINITE_QUERY_LIMIT
	}, {
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		keepPreviousData: true
	})

	return (
		<div></div>
	)
}
