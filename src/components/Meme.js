import React from 'react'
import { ImageBox, StyledImage } from './modules/StyledImg'



const Meme = (props) => {
    const { url, name, onClick } = props
    return (
        <ImageBox>
            <StyledImage src={url} alt={name} onClick={onClick} />
        </ImageBox>
    )
}

export default Meme
