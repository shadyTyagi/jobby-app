import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobData

  return (
    <>
      <Link to={`/jobs/${id}`} className="link">
        <li className="job-item">
          <div className="job-logo-title-card">
            <img
              src={companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div className="job-rating-container">
              <h1 className="title">{title}</h1>
              <div className="star-rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-package-card">
            <div className="location-type">
              <div className="location-icon-location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <p className="type">{employmentType}</p>
            </div>
            <h1 className="package">{packagePerAnnum}</h1>
          </div>
          <hr className="item-hr-line" />
          <div className="about-section">
            <h1 className="heading">Description</h1>
            <p className="description">{jobDescription}</p>
          </div>
        </li>
      </Link>
    </>
  )
}

export default JobCard
