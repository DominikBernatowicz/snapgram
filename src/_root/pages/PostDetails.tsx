import Loader from '@/components/shared/Loader'
import PostStats from '@/components/shared/PostStats'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/context/AuthContext'
import { useDeletePost, useGetPostById } from '@/lib/react-query/queriesAndMutatuions'
import { convertDate } from '@/lib/utils'
import { Link, useNavigate, useParams } from 'react-router-dom'

const PostDetails = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')
  const { user } = useUserContext()

  const { mutate: deletePost, isSuccess: isDeletePost, isPending: isDeleteLoading } = useDeletePost()

  const handleDeletePost = () => {
    deletePost({
      postId: id || '',
      imageId: post?.imageId
    })

    if (!isDeletePost) toast({
      title: 'Please try again'
    })
    
    navigate('/')
  }

  return (
    <div className='post_details-container'>
      {isPending ? <Loader /> : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt='post'
            className='post_details-img'
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className='flex items-center gap-3'
              >
                <img
                  src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {convertDate(post?.$createdAt || '')}
                    </p>
                    -
                    <p>
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt='edit'
                    width={24}
                    height={24}
                  />
                </Link>


                {post?.creator.$id === user.id && <Button
                  onClick={handleDeletePost}
                  variant='ghost'
                  className="post_details-delete_btn"
                >
                  {isDeleteLoading ? <Loader />
                    :
                    <img
                      src="/assets/icons/delete.svg"
                      width={24}
                      height={24}
                      alt="add"
                    />}
                </Button>}
              </div>
            </div>

            <hr className='border w-full border-dark-4/80' />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails