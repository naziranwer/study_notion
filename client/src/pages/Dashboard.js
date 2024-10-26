
import {Outlet} from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar.js'

const Dashboard = () => {


  return (
    <div className='relative flex bg-richblack-400'>
        <Sidebar />
        <div className=' flex-1 overflow-auto bg-richblack-900'>
            <div className='py-10'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default Dashboard