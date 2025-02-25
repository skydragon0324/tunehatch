import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateCurrentLocation } from '../../../Redux/User/UserSlice';

export default function GeoPicker() {
    const currentLocation = useAppSelector((state) => state.user.location.current)
    const dispatch = useAppDispatch()
    const [expanded, setExpanded] = useState(false)
    return <>
    <div className="relative mx-auto justify-center z-30 w-64">
          <span className="bg-blue-400 w-full relative z-10 text-white p-1 justify-around flex items-center rounded-full mb-4 pr-3" onClick={() => setExpanded(!expanded)}>
            <i className="material-symbols-outlined pl-1 pr-1 text-base">
              location_on
            </i>
            {currentLocation}
            <i className="material-symbols-outlined pl-1 text-base">
              {!expanded ? "expand_more" : "expand_less"}
            </i>
          </span>
          <div className={`${!expanded ? "hidden" : "absolute"} top-2 flex flex-col z-0 bg-white border rounded w-full border-gray-100`}>
          <span className='mt-6'>
          </span>
          <span className='p-1 hover:bg-gray-100' onClick={() => {
            dispatch(updateCurrentLocation("Providence, RI"))
            setExpanded(false)
            }}>
            <p className="text-center">Providence, RI</p>
          </span>
          </div>
        </div>
    </>
}
