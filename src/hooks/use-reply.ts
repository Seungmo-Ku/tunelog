import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataConnection } from '@/libs/dto/rating.dto'
import ApiReply from '@/libs/api/api-reply'
import { ReplyCreateRequest, ReplyResponse } from '@/libs/dto/reply.dto'
import { useAtomValue } from 'jotai'
import { DialogCommentAtom } from '@/components/dialogs/dialog-comment'
import { isEmpty } from 'lodash'


export const useGetReplies = (type: 'rating' | 'journal' | 'topster' | null, id?: string, limit: number = 10) => {
    const commentDialog = useAtomValue(DialogCommentAtom)
    
    return useInfiniteQuery<DataConnection<ReplyResponse>, Error>({
        queryKey: ['reply', type, id ?? '', limit],
        queryFn: async ({ pageParam }) => {
            const cursor = typeof pageParam === 'string' ? pageParam : ''
            return await ApiReply._get_replies(type ?? 'rating', id ?? '', limit, cursor) ?? { data: [], nextCursor: undefined }
        },
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        enabled: commentDialog.open && !isEmpty(id) && type !== null
    })
}
export const usePostReply = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({type, id, reply}: {type: 'rating' | 'journal' | 'topster', id: string, reply: ReplyCreateRequest}) => await ApiReply._post_reply(type, id, reply),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reply', variables.type, variables.id]})
        }
    })
}