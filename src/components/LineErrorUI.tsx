import React from 'react';
import lineError from '@/assets/lineLoading.webp'
import reload from '@/assets/reload.webp';
import telegram from '@/assets/telegram.webp';

const LineErrorUI: React.FC<{ onRetry?: () => void; onContact?: () => void }> = ({ onRetry, onContact }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B0712',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#BBBBBB',
    }}>
      <img src={lineError} alt="服务器升级" style={{ width: 163, marginBottom: 32 }} />
      <div style={{ textAlign: 'center', fontSize: 16, marginBottom: 4 }}>
        我们正在升级服务器，稍后回来。
      </div>
      <div style={{ textAlign: 'center', fontSize: 16, marginBottom: 40 }}>
        感谢您的耐心等待！
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <button
        className='w-[140px] h-[48px] rounded-[12px] bg-[#FFFFFF14] flex items-center justify-center'
          onClick={onRetry}
        >
          <img src={reload} alt="重试" className="w-[24] mr-2" />
          再试一次
        </button>
        <button
          className='w-[140px] h-[48px] rounded-[12px] bg-[#FFFFFF14] flex items-center justify-center'
          onClick={onContact}
        >
          <img src={telegram} alt="联系客服" className="w-[24] mr-2" />
          联系客服
        </button>
      </div>
    </div>
  );
};

export default LineErrorUI;

