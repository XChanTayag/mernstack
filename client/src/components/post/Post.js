import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPost } from '../../actions/post';
import { Link, useParams } from 'react-router-dom';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = () => {
  const dispatch = useDispatch();
  const { post, loading } = useSelector((state) => state.post);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [getPost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <section className="container">
        <Link to="/posts" className="btn">
          Back To Posts
        </Link>
        <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id} />
        <div className="comments">
          {post.comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} postId={post._id} />
          ))}
        </div>
      </section>
    </Fragment>
  );
};

export default Post;
