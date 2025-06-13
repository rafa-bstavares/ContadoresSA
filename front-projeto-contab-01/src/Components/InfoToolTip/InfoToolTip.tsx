type TooltipProps = {
    iconSrc: string;
    alt: string;
    tooltipText: string;
  };
  
  const InfoTooltip: React.FC<TooltipProps> = ({ iconSrc, alt, tooltipText }) => {
    return (
      <div className="relative inline-block self-center">
        {/* Ícone que disparará o tooltip */}
        <img src={iconSrc} alt={alt} className="w-4 h-4 object-contain peer" />
        {/* Tooltip: oculto inicialmente, aparece no hover */}
        <div
          className="
            absolute left-full ml-2 top-1/2 transform -translate-y-1/2
            p-2 bg-gray-700 text-white text-xs rounded max-w-xs
            opacity-0 peer-hover:opacity-100 transition-opacity duration-300 z-50
            whitespace-normal break-words w-[500px] hidden peer-hover:flex
          "
        >
          {tooltipText}
        </div>
      </div>
    );
  };
  
  export default InfoTooltip;