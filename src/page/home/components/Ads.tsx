const Ads = ({ ads }: { ads: any }) => {
  return (
    <div className="absolute bottom-[10px] z-[999999] p-3 w-full">
      <a
        target="_blank"
        href={ads?.jump_url}
        className="flex items-center p-4 gap-4  w-full ads-bg"
      >
        <img src={ads?.icon} alt="" width={60} height={60} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="ads-title">{ads?.title}</h1>
            <div className="spon px-2 py-1">{ads?.profile_text}</div>
          </div>
          <p className="ads-p">{ads?.description}</p>
        </div>
      </a>
    </div>
  );
};

export default Ads;
