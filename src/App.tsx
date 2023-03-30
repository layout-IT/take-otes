import React, {useEffect, useState} from 'react'
import './App.scss'

const App = () => {

    useEffect(() => {
        const fromLS = localStorage.getItem("test")
        const newMass = fromLS && JSON.parse(fromLS)
        const sortMass = newMass.sort((a: any, b: any) => a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1)
        setMass(sortMass)
    }, [])

    const [id, setId] = useState(0)
    const [editInput, setEditInput] = useState(false)
    const [editTextarea, setEditTextarea] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [textareaValue, setTextareaValue] = useState('')
    const [mass, setMass] = useState([
        {id: 1, text: 'в', discrption: 'discrption'}
    ])

    const onTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.currentTarget.value && setTextareaValue(e.currentTarget.value)
    }

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.currentTarget.value && setInputValue(e.currentTarget.value)

    }

    const save = () => {
        let maxId = 0
        if (mass.length > 0) {
            for (let i = 0; i < mass.length; i++) {
                if (maxId < mass[i].id) {
                    maxId = mass[i].id
                }
            }
        }

        const newMass = [...mass, {id: maxId + 1, text: inputValue, discrption: textareaValue}]
        setMass(newMass)
        setInputValue('')
        setTextareaValue('')
        localStorage.setItem("test", JSON.stringify(newMass))
    }

    const OneditInput = (e: React.MouseEvent<HTMLLIElement>, id: number, text: string) => {
        setEditTextarea(false)
        setEditInput(true)
        setInputValue(text)
        setId(id)
    }
    const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)
        const obj = mass.find(row => row.id === id)
        const lastMass = mass.filter(row => row.id !== id)
        const neaMass = [...lastMass, {...obj, text: inputValue}]
        // @ts-ignore
        setMass(neaMass)
        !e.currentTarget.checked && setId(0)
        setInputValue('')
    }

    const textAteaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.currentTarget.value)
        setTextareaValue('')

        const obj = mass.find(row => row.id === id)
        const lastMass = mass.filter(row => row.id !== id)
        const neaMass = [...lastMass, {...obj, discrption: textareaValue}]
        // @ts-ignore
        setMass(neaMass)

        setEditTextarea(false)

    }
    const OneditTextarea = (id: number, text: string) => {
        setEditInput(false)
        setEditTextarea(true)
        setTextareaValue(text)
        setId(id)
    }

    const deleteMass = (id: number) => {
        const newMass = mass.filter(row => row.id !== id)
        setMass(newMass)
    }

    return (
        <div className='App'>
            <div className='header'>
                <input className='input' value={!id ? inputValue : ''} onChange={(e) => onInput(e)} type="text"/>
                <textarea className='textarea' value={textareaValue} onChange={(e) => onTextarea(e)}/>
                <button className='button' onClick={save}>save</button>
            </div>
            {
                mass.map(row => <ul key={row.id} className='ul'>
                    {
                        editInput && id === row.id
                            ? <input
                                className='input'
                                value={inputValue}
                                onChange={(e) => onInput(e)}
                                onBlur={(e) => inputBlur(e)}
                                type="text"/>
                            : <li onClick={(e) => OneditInput(e, row.id, row.text)}>{row.text}</li>

                    }
                    {
                        editTextarea && id === row.id
                            ? <textarea
                                className='textarea'
                                value={textareaValue}
                                onChange={(e) => onTextarea(e)}
                                onBlur={(e) => textAteaBlur(e)}
                            />
                            : <li onClick={(e) => OneditTextarea(row.id, row.discrption)}>{row.discrption}</li>
                    }
                    <button onClick={() => deleteMass(row.id)}>x</button>

                </ul>)
            }
        </div>
    );
}

export default App;
