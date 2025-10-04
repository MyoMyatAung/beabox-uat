import Other1 from '../assets/others1.png';
import Other2 from '../assets/other2.png';

const OtherContent = () => {
    return <div className='pb-4'>
        <h1 className='text-sm'>Installation Guide for Other Mobile Phones</h1>
        <div className='mb-1'>
            <p className='text-xs'>Step 1: If this screen appears when you download the app</p>
            <img src={Other1} alt="Step 1" className='w-[260px] h-[186px] text-center mx-auto' />
        </div>
        <div className='mb-1'>
            <p className='text-xs'>Step 2: Please go to the phone settings and turn on "<span className='text-[#A506DD]'>Allow apps from this source</span>" or turn off "<span className='text-[#A506DD]'>Prohibit installation of malicious apps</span>"</p>
            <img src={Other2} alt="Step 2" className='w-[260px] h-[186px] text-center mx-auto' />
        </div>
        <div className='mb-1'>
            <p className='text-xs'>Step 3: <span className='text-[#A506DD]'>Click on the apk again to install it other</span></p>
        </div>
        <div className='mb-1'>
            <h3 className='text-xs'>Other</h3>
            <p className='text-xs'>If you have any questions, please join the QQ group to contact customer service.</p>
            <p className='text-xs'>Thank you for your support.</p>
        </div>
        <button id='button' className='flex mt-1 items-center justify-center gap-2 bg-gradient-to-r from-[#CD3EFF] to-[#FFB2E0] shadow-md text-white rounded-full w-full px-4 py-2'>
            <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8922 0.265478C10.8539 0.222728 9.47579 0.282352 8.27655 1.58397C7.0773 2.88446 7.2618 4.37621 7.2888 4.41446C7.3158 4.45271 8.99879 4.51233 10.0732 2.99921C11.1475 1.4861 10.9304 0.309352 10.8922 0.265478ZM14.6204 13.465C14.5664 13.357 12.0048 12.0768 12.2433 9.6153C12.4818 7.15382 14.1276 6.4777 14.1535 6.40457C14.1794 6.33145 13.4819 5.51583 12.7428 5.10295C12.2 4.81214 11.5994 4.64539 10.9844 4.61471C10.8629 4.61133 10.441 4.50783 9.57366 4.7452C9.00216 4.90158 7.71405 5.40783 7.35967 5.42808C7.00418 5.44833 5.94668 4.84083 4.80931 4.67996C4.08144 4.53933 3.3097 4.82733 2.75732 5.04895C2.20608 5.26945 1.15758 5.8972 0.424085 7.56557C-0.309411 9.23281 0.0742119 11.8743 0.34871 12.6955C0.623209 13.5168 1.05183 14.86 1.78083 15.841C2.42882 16.948 3.28832 17.7164 3.64719 17.9774C4.00607 18.2384 5.01856 18.4116 5.72056 18.0528C6.28531 17.7063 7.30455 17.5071 7.7073 17.5218C8.10892 17.5364 8.90092 17.695 9.71204 18.1281C10.3544 18.3498 10.9619 18.2575 11.5705 18.01C12.1791 17.7614 13.06 16.8186 14.0883 14.9073C14.4783 14.0185 14.6556 13.5378 14.6204 13.465Z" fill="white" />
            </svg>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.36402 2.42557C4.65495 1.39125 6.26042 0.828854 7.9146 0.831491C9.63585 0.831491 11.2178 1.42765 12.4652 2.42557L13.6421 1.24864L14.7874 2.39398L13.6105 3.57091C14.6448 4.86184 15.2072 6.46731 15.2046 8.12149V8.93149H0.624603V8.12149C0.624603 6.40024 1.22076 4.81831 2.21868 3.57091L1.04175 2.39479L2.18709 1.24945L3.36402 2.42557ZM0.624603 10.5515H15.2046V16.2215C15.2046 16.4363 15.1193 16.6423 14.9674 16.7942C14.8154 16.9461 14.6094 17.0315 14.3946 17.0315H1.4346C1.21978 17.0315 1.01375 16.9461 0.861847 16.7942C0.709942 16.6423 0.624603 16.4363 0.624603 16.2215V10.5515ZM5.4846 6.50149C5.69943 6.50149 5.90545 6.41615 6.05736 6.26424C6.20926 6.11234 6.2946 5.90631 6.2946 5.69149C6.2946 5.47666 6.20926 5.27064 6.05736 5.11873C5.90545 4.96683 5.69943 4.88149 5.4846 4.88149C5.26978 4.88149 5.06375 4.96683 4.91184 5.11873C4.75994 5.27064 4.6746 5.47666 4.6746 5.69149C4.6746 5.90631 4.75994 6.11234 4.91184 6.26424C5.06375 6.41615 5.26978 6.50149 5.4846 6.50149ZM10.3446 6.50149C10.5594 6.50149 10.7655 6.41615 10.9174 6.26424C11.0693 6.11234 11.1546 5.90631 11.1546 5.69149C11.1546 5.47666 11.0693 5.27064 10.9174 5.11873C10.7655 4.96683 10.5594 4.88149 10.3446 4.88149C10.1298 4.88149 9.92375 4.96683 9.77184 5.11873C9.61994 5.27064 9.5346 5.47666 9.5346 5.69149C9.5346 5.90631 9.61994 6.11234 9.77184 6.26424C9.92375 6.41615 10.1298 6.50149 10.3446 6.50149Z" fill="white" />
            </svg>
            <label htmlFor="button">IOS / Android下载</label>
        </button>
    </div>
}

export default OtherContent;
