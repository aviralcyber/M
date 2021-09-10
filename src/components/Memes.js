import React, { useState, useEffect } from 'react'
import Meme from './Meme'
import { StyledMain } from './modules/StyledMain'
import { StyledTitle } from './modules/StyledTitle'
import { StyledContainer } from './modules/StyledContainer'
import { Form, StyledInput, SubmitButton } from './modules/StyledForm'
import { ImageBox, StyledImage } from './modules/StyledImg'

const objectToQueryParam = (obj) => {
    const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
    return '?' + params.join("&")
}

const Memes = () => {
    const [templates, setTemplates] = useState([])
    const [template, setTemplate] = useState(null)
    const [textTop, setTextTop] = useState("")
    const [textBottom, setTextBottom] = useState("")
    const [meme, setMeme] = useState(null)
    const [search, setSearch] = useState("")
    const [searchTemps, setSearchTemps] = useState([])

    const getTemplates = async () => {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json()
        const templates = await data.data.memes;
        setTemplates(templates)
    }

    useEffect(() => {
        getTemplates()
    }, [])

    const formHandle = async (e) => {
        e.preventDefault()
        const params = {
            template_id: template.id,
            text0: textTop,
            text1: textBottom,
            username: "wtcsmemer",
            password: "memesareessential"
        };
        const response = await fetch(
            `https://api.imgflip.com/caption_image${objectToQueryParam(params)}`
        )

        const json = await response.json()
        console.log(json)
        const memeUrl = json.data.url;
        console.log(memeUrl)
        setMeme(memeUrl)
    }

    const download = e => {
        console.log(e.target.href);
        fetch(e.target.href, {
          method: "GET",
          headers: {}
        })
          .then(response => {
            response.arrayBuffer().then(function(buffer) {
              const url = window.URL.createObjectURL(new Blob([buffer]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "memer.png");
              document.body.appendChild(link);
              link.click();
            });
          })
          .catch(err => {
            console.log(err);
          });
      };

    if (meme) {
        return (
            <StyledMain>
                <ImageBox>
                    <StyledImage src={meme} />
                    <a href={meme} download onClick={(e) => download(e)}>
                        Download
                    </a>
                </ImageBox>
            </StyledMain>

        )
    }

    return (
        <StyledMain>
            {template && (
                <React.Fragment>
                    <Form onSubmit={formHandle}>
                        <Meme key={template.id} {...template} />

                        <StyledInput
                            placeholder="top text"
                            value={textTop}
                            onChange={(e) => setTextTop(e.target.value)}
                            required
                        />
                        <StyledInput
                            placeholder="bottom text"
                            value={textBottom}
                            onChange={(e) => setTextBottom(e.target.value)}
                            required
                        />
                        <SubmitButton>Create a Meme</SubmitButton>
                    </Form>
                </React.Fragment>
            )}
            {!template && !search && (
                <React.Fragment>
                    <StyledTitle>Choose a template</StyledTitle>
                    <StyledInput
                            placeholder="Search your meme..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setSearchTemps(templates.filter(temp =>
                                    temp.name.toLowerCase().includes(e.target.value.toLowerCase())
                                     ))
                            }}
                    />
                    <StyledContainer>
                        {templates.map((template) => {
                            return (
                                <Meme key={template.id} {...template} onClick={() => {
                                    setTemplate(template)
                                }}
                                />
                            )
                        })}

                    </StyledContainer>
                </React.Fragment>
            )}
            {!template && search && (
                <React.Fragment>
                    <StyledTitle>Choose a template</StyledTitle>
                    <StyledInput
                            placeholder="Search your meme..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setSearchTemps(templates.filter(temp =>
                                    temp.name.toLowerCase().includes(e.target.value.toLowerCase())
                                     ))
                            }}
                    />
                    <StyledContainer>
                        {
                            searchTemps.map((template) => {
                            return (
                                <Meme key={template.id} {...template} onClick={() => {
                                    setTemplate(template)
                                }}
                                />
                            )
                        })}

                    </StyledContainer>
                </React.Fragment>
            )}
        </StyledMain>


    )
}

export default Memes;