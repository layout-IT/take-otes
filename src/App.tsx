import React, {ChangeEvent, useEffect, useState} from 'react'
import './App.scss'

type objType = {
    id: number,
    text: string,
    discrption: string,
}
const App = () => {

    useEffect(() => {
        const fromLS: string | null = localStorage.getItem("test")
        if (fromLS) {
            const newMass = JSON.parse(fromLS)
            const sortMass: objType[] = newMass.sort((a: objType, b: objType) => a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1)
            setMass(sortMass)
        }
    }, [])

    const [id, setId] = useState(0)

    const [editInput, setEditInput] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [showDaneModal, setShowDaneModal] = useState(false)
    const [editTextarea, setEditTextarea] = useState(false)
    const [showMass, setShowMass] = useState(false)
    const [showSetMass, setShowSetMass] = useState(false)

    const [inputValue, setInputValue] = useState('')
    const [textareaValue, setTextareaValue] = useState('')

    const [mass, setMass] = useState<objType[]>([
        {id: 1, text: 'в', discrption: 'discrption'}
    ])

    useEffect(() => {
        if (showDaneModal) {
            setTimeout(() => {
                setShowDaneModal(false)
            }, 3000)
        }
    }, [showDaneModal])

    if (confirm) {
        document.body.style.overflow = "hidden"
    } else {
        document.body.style.overflow = "auto"
    }

    const onTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.currentTarget.value)
    }

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)

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
    }

    const addMassImport = (e:  React.ChangeEvent<HTMLTextAreaElement>) => {
        setMass(JSON.parse(e.currentTarget.value))
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
        const neaMass = obj && lastMass && [...lastMass, {...obj, text: inputValue}]
        neaMass && setMass(neaMass)
        !e.currentTarget.checked && setId(0)
        setInputValue('')
    }

    const textAreaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.currentTarget.value)
        setTextareaValue('')
        const obj = mass.find(row => row.id === id)
        const lastMass = mass.filter(row => row.id !== id)
        const neaMass = obj && lastMass && [...lastMass, {...obj, discrption: textareaValue}]
        neaMass && setMass(neaMass)
        setEditTextarea(false)

    }
    const OneditTextarea = (id: number, text: string) => {
        setEditInput(false)
        setEditTextarea(true)
        setTextareaValue(text)
        setId(id)
    }

    const deleteMass = (id: number) => {
        if (confirm) {
            const newMass = mass.filter(row => row.id !== id)
            setMass(newMass)
            setConfirm(false)
        }

        return
    }
    return (
        <div className={`App`}>
            <div className='header'>
                <div className='inputAndSave'>
                    <button className='button' onClick={() => {
                        localStorage.setItem("test", JSON.stringify(mass))
                        setShowDaneModal(true)
                    }}>Сохранить перед выходом
                    </button>
                    <input className='input' value={inputValue} onChange={(e) => onInput(e)} type="text"/>
                </div>
                <textarea className='textarea' value={textareaValue} onChange={(e) => onTextarea(e)}/>

                <div className='buttons'>
                    <button className='button' onClick={save}>save</button>
                    <button className='button' onClick={() => setShowMass(true)}>showMass</button>
                    <button className='button' onClick={() => setShowSetMass(true)}>setMass</button>
                </div>
                {showMass && (
                    <div className='showModal'>
                        <span>{JSON.stringify(mass)}</span>
                        <button onClick={() => setShowMass(false)} className='button'>Ok</button>
                    </div>

                )}
                {showSetMass && (
                    <div className='confirm'>
                        <textarea onChange={addMassImport}></textarea>
                        <button onClick={() => setShowSetMass(false)} className='button'>Ok</button>
                    </div>

                )}
                {showDaneModal && (
                    <div className='showDaneModal'>
                        <span>Успешно сохранено</span>
                    </div>

                )}
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
                                onBlur={(e) => textAreaBlur(e)}
                            />
                            : <li onClick={(e) => OneditTextarea(row.id, row.discrption)}>{row.discrption}</li>
                    }
                    <li>
                        <button
                            onClick={() => {
                                setId(row.id)
                                setConfirm(true)
                            }}
                            className='button'>X
                        </button>
                    </li>
                    {confirm && (
                        <div className='showModalForDelete'>
                            <span>Точно удалить <br/> "{row.text}" ?</span>
                            <div className='buttons'>
                                <button onClick={() => deleteMass(id)} className='button'>Ok</button>
                                <button onClick={() => setConfirm(false)} className='button'>Отмена</button>
                            </div>
                        </div>

                    )}
                </ul>)
            }
        </div>
    );
}

export default App;
