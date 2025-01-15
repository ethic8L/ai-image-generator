import "./ImageGenerator.css"
import default_image from '../Assets/default_image.svg'
import { useRef, useState } from "react"


const ImageGenerator = () => {

  const [image_url, setImage_url] = useState("/");
  let inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey || inputRef.current.value === "") {
      return; // early exit if input is empty
    }
  
    setLoading(true);
    
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: `${inputRef.current.value}`,
          n: 1,
          size: "312x312"
        })
      });
  
      const data = await response.json();

      setImage_url(data.data[0]?.url || default_image);
    } catch (error) {
        console.error("Error generating image:", error);
        setImage_url(default_image); // Fallback
    }
  
      
    setLoading(false);
  };
  


  return (
    <div className="ai-image-generator">
      <div className="header">AI image <span>generator</span></div>  
      <div className="img-loading">
      <img src={image_url === "/" ? default_image : image_url} alt="" />
        <div className="loading">
          <div className={loading?"loading-bar-full":"loading-bar"}></div>
          <div className={loading?"loading-text":"display-none"}>Loading...</div>
        </div>
      </div> 

      <div className="search-box">
        <input type="text" ref={inputRef} className="search-input" placeholder="Describe what you want to see"/>
        <div className="generate-btn" onClick={()=>{imageGenerator()}}>Generate</div>
        </div>  
      </div>
  )
}

export default ImageGenerator
