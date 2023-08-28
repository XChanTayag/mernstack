import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import { Link, useParams } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { profile, loading } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfileById(id));
  }, [dispatch, getProfileById, id]);

  const checkIfAuthUser = () =>
    auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id;

  return (
    <section className="container">
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back to Profiles
          </Link>
          {checkIfAuthUser() && (
            <Link to="/edit-profile" className="btn btn-dark">
              Edit Profile
            </Link>
          )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((experience) => (
                    <ProfileExperience key={experience._id} experience={experience} />
                  ))}
                </Fragment>
              ) : (
                <h4>No Experience credentials</h4>
              )}
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((education) => (
                    <ProfileEducation key={education._id} education={education} />
                  ))}
                </Fragment>
              ) : (
                <h4>No Education credentials</h4>
              )}
            </div>

            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};

export default Profile;
