import React from 'react';
import pizza from '../../../assets/explore/pizza.png'
interface PoppizzaProps {
  
}

const Poppizza: React.FC<PoppizzaProps> = ({}) => {
  return (
    <div className=' py-[20px]'>
        <h1 className=' text-white text-[14px] font-[500] leading-[20px] pb-[12px]'>Popular app</h1>
        <div className=" grid grid-cols-5 gap-[12px]">
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
       
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        <div className=" flex flex-col justify-center items-center gap-[4px]">
            <img className=' w-[56px] h-[53px] rounded-[6px]' src={pizza} alt="" />
            <h1 className=' text-white text-[10px] font-[400]'>Artic Pro</h1>
        </div>
        </div>
    </div>
  );
};

export default Poppizza;