import React from 'react'
import CTAButton from "../HomePage/Button"
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'

const CodeBlocks = ({
    position,heading,subheading,ctabtn1,ctabtn2,codeColor,codeblock
}) => {
  return (
    // First part
    <div className={`flex ${position} my-20 justify-between gap-10 flex-wrap`}>
          <div className=' flex flex-col gap-6 lg:w-[50%] p-4'>
                 {heading}
                <div className='text-richblack-300 font-bold text-sm  md:text-lg'>
                    {subheading}
                </div>
                <div className='flex gap-7 py-3'>
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.btnText}
                            <FaArrowRight/>
                        </div>
                    </CTAButton>

                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>  
                            {ctabtn2.btnText}
                    </CTAButton>
                </div>
           </div>
    
            <div className=' h-fit  flex flex-row text-10[px] w-[100%] py-3 mt-5 lg:w-[500px] glass border border-richblack-600 shadow-md shadow-richblack-5  '> 
                {/*HW -> BG gradient*/}

                <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 relative`}>
                <TypeAnimation
                    sequence={[codeblock, 2000, ""]}
                    repeat={Infinity}
                    cursor={true}
                
                    style = {
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                            overflowX:"hidden",
                            fontSize:"16px",
                        }
                    }
                    omitDeletionAnimation={true}
                />
                </div>
            </div>
    </div>
    
  )
}

export default CodeBlocks