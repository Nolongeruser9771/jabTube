import classNames from 'classnames/bind'
import styles from './Comments.module.scss'
import { useState, useEffect, useContext, useRef } from 'react'
import Thumbnail from '../../../../../Home/components/VideoList/components/Thumbnail/Thumbnail'
const API_URL = 'http://localhost:8080'
import FilmPlayContext from '../../../../../../context/PlayFilmContext/FilmPlayContext'
import UserContext from '../../../../../../context/UserContext/UserContext'
import defaultAvatar from '../../../../../../assets/images/default-avatar.jpg'
import moment from 'moment'

const cx = classNames.bind(styles)

export default function Comments() {
    const { videoPlay, dispatchComments } = useContext(FilmPlayContext)
    const { user } = useContext(UserContext)

    //call api gọi comments by video id
    const [videoComment, setVideoComment] = useState()

    //get film avatar
    useEffect(() => {
        getVideoComments(videoPlay)
    }, [videoPlay])

    const getVideoComments = async (videoPlay) => {
        if (Object.keys(videoPlay).length !== 0) {
            try {
                const commentFetch = await fetch(API_URL + '/api/v1/comments?videoId=' + videoPlay.id)
                const res = await commentFetch.json()
                console.log(res)
                if (!res.message) {
                    setVideoComment(res)
                    console.log(videoComment)
                    return
                }
                setVideoComment([])
            } catch (error) {
                console.log(error)
            }
        }
        setVideoComment([])
    }

    const [commentInput, setCommentInput] = useState()

    const onChangeHandle = (e) => {
        if (e) {
            setCommentInput(e.target.value)
        }
    }

    //Thêm bình luận
    const addCommentHandle = async (e) => {
        if ((e.keyCode === 13) & (e.target.value !== '')) {
            //call api
            const commentInput = e.target.value
            try {
                const commentFetch = await fetch(
                    API_URL + `/api/v1/comments/create?userId=${user.id}&videoId=${videoPlay.id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json; charset=utf-8',
                        },
                        body: JSON.stringify(commentInput),
                    }
                )
                const res = await commentFetch.json()
                if (!res.message) {
                    console.log('new comment')
                    setVideoComment([res, ...videoComment])
                    setCommentInput('')
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //chỉnh sửa bình luận
    const [editingCommentValue, setEditingCommentValue] = useState()
    const [editingCommentId, setEditingCommentId] = useState()
    const [deleteCommentId, setdeleteCommentId] = useState()

    //function to add input comment into dom
    const onUpdateHandle = (comment) => {
        setEditingCommentId(comment.id)
        setEditingCommentValue(comment.content)
    }

    //input change
    const handleInputChange = (e) => {
        if (e) {
            setEditingCommentValue(e.target.value)
        }
    }
    //update confirm
    const handleUpdateCommentConfirm = async (e) => {
        if (e.keyCode === 13) {
            try {
                const commentFetch = await fetch(API_URL + `/api/v1/comments/edit?userId=${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        commentId: editingCommentId,
                        content: editingCommentValue,
                    }),
                })
                const res = await commentFetch.json()
                if (!res.message) {
                    console.log('new comment')
                    setVideoComment(
                        videoComment.map((comment) => {
                            if (comment.id === editingCommentId) {
                                return { ...comment, content: editingCommentValue, updatedAt: moment.now() }
                            }
                            return comment
                        })
                    )
                    setEditingCommentValue('')
                    setEditingCommentId(null)
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //cancel update
    const onCancelUpdate = () => {
        setEditingCommentId(null)
    }

    //delete comment
    const onDeleteHandle = (comment) => {
        setdeleteCommentId(comment.id)
    }

    //cancel delete
    const cancelDeleteCommentHandle = () => {
        setdeleteCommentId(null)
    }

    //confirm delete
    const confirmDeleteCommentHandle = async () => {
        try {
            const commentFetch = await fetch(
                API_URL + `/api/v1/comments/delete?userId=${user.id}&commentId=${deleteCommentId}`,
                {
                    method: 'DELETE',
                }
            )
            const res = await commentFetch.text()
            if (!res.message) {
                console.log('new comment')
                setVideoComment(videoComment.filter((comment) => comment.id != deleteCommentId))
                setdeleteCommentId(null)
            }
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    //------------------------------------------avatar fetch------------------------------------------
    const [userAvatar, setUserAvatar] = useState()
    useEffect(() => {
        if (user) {
            getAvatar(user.avatar)
            return
        }
        setUserAvatar(defaultAvatar)
    }, [user])

    //lấy avatar
    const getAvatar = async (avatar) => {
        if (!avatar) {
            setUserAvatar(defaultAvatar)
            return
        }
        try {
            const avatarFetch = await fetch(API_URL + avatar)
            const res = await avatarFetch.blob()
            setUserAvatar(URL.createObjectURL(res))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={cx('comment-container')}>
            <hr />
            <h4>{videoComment ? videoComment.length : ''} Bình luận</h4>

            {user ? (
                <div className={cx('add-comment')}>
                    <img src={userAvatar} />
                    <input
                        onKeyDown={addCommentHandle}
                        value={commentInput ? commentInput : ''}
                        onChange={onChangeHandle}
                        type="text"
                        placeholder="Write comments....."
                    />
                </div>
            ) : (
                <></>
            )}

            <div>
                {/* map comments */}
                {videoComment
                    ? videoComment.map((comment) => (
                          <div
                              key={`comment-${comment.id}`}
                              className={cx('old-comment')}
                              id={cx(`container-comment-${comment.id}`)}
                          >
                              {/* Sau này sửa lại tên thumbnail */}
                              <div id={cx('comment-user-avatar')}>
                                  <Thumbnail thumbnail={comment.user.avatar} />
                              </div>

                              <div className={cx('comment-content')}>
                                  <h3>
                                      {comment ? comment.user.username : ''}
                                      <span>
                                          {comment
                                              ? comment.updatedAt === null
                                                  ? moment(comment.createdAt).fromNow()
                                                  : 'Đã chỉnh sửa vào ' + moment(comment.updatedAt).fromNow()
                                              : ''}
                                      </span>
                                  </h3>

                                  {comment.id !== editingCommentId ? <p>{comment ? comment.content : ''}</p> : <></>}

                                  {/* update comment input */}
                                  {user ? (
                                      <>
                                          {(user.id === comment.user.id) & (editingCommentId === comment.id) ? (
                                              <>
                                                  <div className={cx('add-comment')} id={cx('add')}>
                                                      <input
                                                          value={editingCommentValue ? editingCommentValue : ''}
                                                          onKeyDown={(e) => handleUpdateCommentConfirm(e)}
                                                          onChange={(e) => handleInputChange(e)}
                                                          type="text"
                                                          placeholder="Write comments....."
                                                      />
                                                  </div>
                                                  <div className={cx('acomment-action')}>
                                                      <span onClick={onCancelUpdate}>Hủy Chỉnh sửa</span>
                                                  </div>
                                              </>
                                          ) : (
                                              <>
                                                  {/* lúc trước content ở đây */}
                                                  {user.id === comment.user.id ? (
                                                      <div className={cx('acomment-action')}>
                                                          <span onClick={() => onUpdateHandle(comment)}>Chỉnh sửa</span>
                                                          <span onClick={() => onDeleteHandle(comment)}>
                                                              Xóa bình luận
                                                          </span>
                                                      </div>
                                                  ) : (
                                                      <></>
                                                  )}
                                                  {(user.id === comment.user.id) & (deleteCommentId === comment.id) ? (
                                                      <div className={cx('delete-comment-btn')}>
                                                          <p>Bạn chắc chắn muốn xóa bình luận này?</p>
                                                          <div>
                                                              <span onClick={cancelDeleteCommentHandle}>Hủy bỏ</span>
                                                              <span onClick={confirmDeleteCommentHandle}>Đồng ý</span>
                                                          </div>
                                                      </div>
                                                  ) : (
                                                      <></>
                                                  )}
                                              </>
                                          )}
                                      </>
                                  ) : (
                                      <></>
                                  )}
                              </div>
                          </div>
                      ))
                    : 'Not founded'}
            </div>
        </div>
    )
}
