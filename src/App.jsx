import { useState, useEffect, useRef } from 'react';
import { Paginator } from 'primereact/paginator';
import TextField from '@mui/material/TextField';
import { InputText } from 'primereact/inputtext';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/themes/lara-dark-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'animate.css';
import './App.css';

const App = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(20);//esto para el paginator : numero de registros por pagina
  const [personajes, setPersonajes] = useState([]);
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState('');
  const [paginas, setPaginas] = useState(0);
  const [todos, setTodos] = useState([]);
  const [pagActual, setPagActual] = useState(1);
  const [nombre, setNombre] = useState('');
  const inputRef = useRef(null);
  const selectStatus = useRef('');

  useEffect(() => {
    pag1();
  }, []);
  //TODO: BOTON DE SUBIR ARRIBA
  //TODO: IR A UNA PAGINA ESPECIFICA
  //TODO: TE PUEDES GUARDAR TUS FAVORITOS
  const toggleFlip = (index) => {
    /*setStatus('');
    setNombre('');*/
    if(checked){
      //console.log('muestra todos');
      const nuevosTodos = [...todos];
      nuevosTodos[index].flipped = !nuevosTodos[index].flipped;
      setTodos(nuevosTodos);
    }else{
      //console.log('con paginacion');
      const nuevosPersonajes = [...personajes];
      nuevosPersonajes[index].flipped = !nuevosPersonajes[index].flipped;
      setPersonajes(nuevosPersonajes);
    }
    
  };

  const pag1 = async() => {
    const {data} = await axios(`https://rickandmortyapi.com/api/character/`); 
    setPaginas(data.info.pages);
    setPersonajes(data.results); 
  }

  const mostrarTodos = async (event) => {
    //console.log(event.target.checked);
    setStatus('');
    setNombre('');
    if(!event.target.checked){

      setTodos([]);
      setChecked(!checked);
      //console.log(todos.length);   
    }else{
      
      const array = Array.from({ length: paginas });
      let acumulados = [];
      for (let index = 0; index < array.length; index++) {
        const {data} = await axios(`https://rickandmortyapi.com/api/character/?page=${index+1}`);
        data.results.forEach((obj, i) => {
          acumulados.push(obj);
        });
      } 
      //console.log(acumulados);
      setTodos(acumulados);
      setChecked(!checked);  
    }
    
  };
  const estado = async(event) => {
    setStatus(event.target.value);
    console.log(event.target.value, nombre);

    if(!checked){
      const {data} = await axios(`https://rickandmortyapi.com/api/character/?page=${pagActual}`);
      const nuevosPersonajes = data.results.filter((el, i) => {
        if(el.status.toLowerCase().trim().includes(event.target.value.toLowerCase().trim()) && 
        el.name.toLowerCase().trim().includes(nombre.toLowerCase().trim())){
          return el;
        }
      });
      console.log(`${nuevosPersonajes.length} Resultados`); 
      setPersonajes(nuevosPersonajes);
    }else{
      let acumulados = [];
      const array = Array.from({ length: paginas });
      for(let index = 0; index < array.length; index++){
        const {data} = await axios(`https://rickandmortyapi.com/api/character/?page=${index+1}`);
        data.results.forEach((obj, i) => {
          if(obj.status.toLowerCase().trim().includes(event.target.value.toLowerCase().trim()) && 
          obj.name.toLowerCase().trim().includes(nombre.toLowerCase().trim())){
            acumulados.push(obj);
          }
        });
      }   
      console.log(`${acumulados.length} Resultados`);  
      setTodos(acumulados);      
    }
  };

  const filtro = async(event) => {
    setNombre(event.target.value);
    console.log(event.target.value, status);
    if(!checked){
      const {data} = await axios(`https://rickandmortyapi.com/api/character/?page=${pagActual}`);
      const nuevosPersonajes = data.results.filter((el, i) => {
        if(el.name.toLowerCase().trim().includes(event.target.value.toLowerCase().trim()) && 
           el.status.toLowerCase().trim().includes(status.toLowerCase().trim())){
          return el;
        }
      });
      console.log(`${nuevosPersonajes.length} Resultados`); 
      setPersonajes(nuevosPersonajes);
    }else{
      let acumulados = [];
      const array = Array.from({ length: paginas });
      for(let index = 0; index < array.length; index++){
        const {data} = await axios(`https://rickandmortyapi.com/api/character/?page=${index+1}`);
        data.results.forEach((obj, i) => {
          if(obj.name.toLowerCase().trim().includes(event.target.value.toLowerCase().trim()) && 
          obj.status.toLowerCase().trim().includes(status.toLowerCase().trim())){
            acumulados.push(obj);
          }
        });
      }   
      console.log(`${acumulados.length} Resultados`);  
      setTodos(acumulados);      
    }

  }

  const goToPage = (event) => {
    if (event.key === 'Enter') {
      //console.log('Enter presionado!', inputRef.current.value);
      onPageChange(event);
      /*if(inputRef.current.value > 0 && inputRef.current.value <= 42){
        setPagActual(inputRef.current.value);
        setFirst(inputRef.current.value);
      }else{
        console.log('de la pagia 1 a la 42');
      }*/
    }
  }
  const onPageChange = async(event) => {

    if(event.key === 'Enter'){
      let pagina = parseInt(inputRef.current.value);
      if(pagina > 0 && pagina <= 42){
        setPagActual(pagina);
        setFirst(rows * (pagina - 1));
        setRows(rows);
        const {data} = await axios(`https://rickandmortyapi.com/api/character/?page=${pagina}`);
        setPersonajes(data.results);
        console.log('Enter presionado!', pagina);
      }else{
        console.log('de la pagia 1 a la 42');
      }
    }else{
      setPagActual(event.page+1);
      setFirst(event.first);
      setRows(event.rows);
      const {data} = await axios(`https://rickandmortyapi.com/api/character/?page=${event.page+1}`);
      setStatus('');
      setNombre('');
      setPersonajes(data.results);
    }   
  };
  return (
    <>
        {!checked && 
          <div style={{display:'flex', justifyContent:'center', gap:'10px'}}>
          <Paginator
          first={first}
          rows={rows}
          totalRecords={826}
          onPageChange={onPageChange}
        /> 
        <InputText ref={inputRef} type="number" min={1} max={42} placeholder='nº pag' className="p-inputtext-sm" inputMode="numeric" onKeyDown={goToPage} />
        </div>       
        }
        <div className='filtro'>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120, margin:'0px', marginRight:'10px' }}>
        <InputLabel id="demo-simple-select-filled-label" 
            sx={{
              color: 'orange', // Cambia el color del texto del label
              '&.Mui-focused': {
                color: 'orange', // Cambia el color del texto del label cuando está enfocado
              }
            }}>
          Status
        </InputLabel>
        <Select
          ref={selectStatus}
          sx={{ 
            color: 'white', 
            backgroundColor:'#1f2937', 
            borderTopLeftRadius:'5px', 
            borderTopRightRadius:'5px',
            
            '&:hover': {
              backgroundColor: '#2f3e4b', // Cambia el color de fondo al hacer hover
            },
            '&.Mui-focused': {
              backgroundColor: '#1f2937', // Cambia el color de fondo cuando está enfocado
            },
            '& .MuiSelect-icon': {
              color: 'orange', // Oculta la flecha predeterminada del Select
            }
          }}
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={status}
          onChange={estado}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'Unknow'}>Unknow</MenuItem>
          <MenuItem value={'Alive'}>Alive</MenuItem>
          <MenuItem value={'Dead'}>Dead</MenuItem>
        </Select>
      </FormControl>
        <TextField
          onChange={filtro}
          value={nombre}
          id="outlined-required"
          label="nombre"
          variant="filled"
          inputProps={{ style: { color: 'white', backgroundColor:'#1f2937', borderTopLeftRadius:'5px', borderTopRightRadius:'5px' } }}
          InputLabelProps={{
            style: { color: 'orange' } // Cambia el color de la etiqueta del TextField
          }}
          
        />
        <div className='mostrar-todos'>
          <span>Mostrar todos</span>
        <Switch
              value={checked}
              checked={checked}
              onChange={mostrarTodos}
              color="warning"
              inputProps={{ 'aria-label': 'controlled' }}
            />

        </div>

        </div>
        <div className='personajes'>
          {!checked &&
            personajes.map( (personaje, index) => {
              return (
                <div key={index} className='personaje' onClick={() => toggleFlip(index)}>
                  <div className={`card ${personaje.flipped ? 'flipped' : ''}`}>
                    <div className='front'>
                      <img className='img-personaje' src={personaje.image} alt={`imagen de ${1}`} />
                    </div>
                    <div className='back'>
                      <p className='name-personaje'>{personaje.status}</p>
                      <p className='name-personaje'>{personaje.name}</p>
                      <p className='name-personaje'>{personaje.gender}</p>
                      <p className='name-personaje'>{personaje.species}</p>
                      <p className='name-personaje'>{personaje.location.name}</p>
                    </div>
                  </div>
                </div>
              );
            })
          }
          {checked &&
            todos.map( (personaje, index) => {
              return (
                <div key={index} className='personaje' onClick={() => toggleFlip(index)}>
                  <div className={`card ${personaje.flipped ? 'flipped' : ''}`}>
                    <div className='front'>
                      <img className='img-personaje' src={personaje.image} alt={`imagen de ${1}`} />
                    </div>
                    <div className='back'>
                      <p className='name-personaje'>{personaje.status}</p>
                      <p className='name-personaje'>{personaje.name}</p>
                      <p className='name-personaje'>{personaje.gender}</p>
                      <p className='name-personaje'>{personaje.species}</p>
                      <p className='name-personaje'>{personaje.location.name}</p>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
    </>
  )
}

export default App;
