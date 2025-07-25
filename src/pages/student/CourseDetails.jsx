import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
// import { Link } from 'react-router-dom'
import YouTube from 'react-youtube'


const CourseDetails = () => {
  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({}) //for the dropdown 
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [PlayerData, setPlayerData] = useState(null)

  const { allCourses, calculateRating, calculateChapterTime, calculateNoOfLectures, calculateCourseDuration, currency } = useContext(AppContext)

  // function to fetch the individual course data
  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id)        //if the id is matching then we get the course
    setCourseData(findCourse)
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses])

  const toggleSection = (index) => {
    setOpenSection((prev) => (
      { ...prev, [index]: !prev[index] }
    ))

  }

  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>

        <div className='absolute top-0 left-0 w-full h-[500px] -z-[-1] bg-gradient-to-b from-indigo-300/70'></div>
        {/* left column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='font-semibold text-gray-800 text-[26px] leading-[36px] md:text-[36px] md:leading-[44px]'>
            {courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>

          {/* reviews and rating */}
          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img className='w-3.5 h-3.5' key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='star' />
              ))}
            </div>
            <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>

            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
          </div>

          <p className='text-sm'>Course by <span className='text-blue-600 underline'>Aryan</span></p>

          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>

            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                    <div className='flex items-center gap-2'>
                      <img className={`transform transition-transform ${openSection[index] ? 'rotate-180' : 'rotate-0'}`}
                        src={assets.down_arrow_icon} alt="arrowIcon" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all ease-in duration-300 ${openSection[index] ? 'max-h-96' : 'hidden'}`}>
                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, index) => (
                        <li key={index} className='flex items-start py-1 gap-2'>
                          <img src={assets.play_icon} alt="playicon" className='w-4 h-4 mt-1' />
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {/* for preview */}
                              {lecture.isPreviewFree && <p onClick={() => setPlayerData({videoId:lecture.lectureUrl.split('/').pop()})}  
                              className='text-blue-500 cursor-pointer'>Preview</p>}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}

            </div>
          </div>

          <div className='py-20 text-sm md:text-default'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-3 rich-text'
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>
          </div>

        </div>
        {/* right column */}
        <div className='max-w-[424px] z-10 shadow-[0px_4px_15px_2px_rgba(0,0,0,0.1)] rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>

        {PlayerData ? 
              <YouTube videoId={PlayerData.videoId} opts={{playerVars:{autoplay:1}}} iframeClassName='w-full aspect-video'/>
              :
              <img src={courseData.courseThumbnail} alt="thumbnail" />
              
              }

          <div className='p-5'>
            <div className='flex items-center gap-2'>
             
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="timeleftclockicon" />
              

              <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
            </div>

            <div className='flex gap-3 items-center pt-2'>
              <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
              <p className='md:text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>
              <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
            </div>

            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>

              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>

              <div className='h-4 w-px bg-gray-500/40'></div>

              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="clock icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>

            </div>

            <button className='md:mt-6 mt-4 w-full py-3 rounded text-white text-sm bg-blue-600 font-medium hover:bg-blue-700'>{isAlreadyEnrolled?"Already Enrolled":"Enroll Now"}</button>

            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
      <Footer/>
    </>
  ) : <Loading />
  // (<div className='flex items-center h-screen justify-center'>
  // <Loading/>
  // </div>) 
}

export default CourseDetails