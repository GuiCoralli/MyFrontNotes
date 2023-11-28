import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import { api } from '../../services/api';

import { Container, Brand, Menu, Search, Content, NewNote } from "./styles";

import {ButtonText} from '../../components/ButtonText';
import {Section} from '../../components/Section';
import {Header} from '../../components/Header';
import {Input} from '../../components/Input';
import {Note} from '../../components/Note';


export function Home() {
    const [tags, setTags] = useState([]);
    const [tagsSelected, setTagsSelected] = useState([]);
    const [search, setSearch] = useState("");
    const [notes, setNotes] = useState([]);

    const navigate = useNavigate();
    
    function handleTagSelected(tagName) {
        if  (tagName === "all") {
            return setTagsSelected([]);
        }




        const alreadySelected = tagsSelected.includes(tagName);
        if (alreadySelected) {
          const filteredTags =  tagsSelected.filter( tag => tag !== tagName);
          
          setTagsSelected(filteredTags);

        } else {
         setTagsSelected(prevState => [...prevState, tagName ]);
        }
    }

    function handleDetails(id) {
        navigate(`/details/${id}`);
    }


    useEffect(() => {
      async function fetchTags() {
        const response = await api.get("/tags");
        setTags(response.data);
      }
      
      fetchTags();
    }, []);


    useEffect(() => {
        async function fetchNotes() {
        const response = await api.get(`/notes?title=${search}&tags=${tagsSelected}`);
        setNotes(response.data);
      }
       
      fetchNotes();
    }, [tagsSelected, search]);


    return (
        <Container>
            <Brand>
                <h1> Rocket_Notes </h1>
            </Brand>

            <Header />

            <Menu>
              <li>
                <ButtonText 
                    title="Todos" 
                    onClick={() => handleTagSelected("all")}
                    $isactive ={tagsSelected.length === 0}
                    />
                </li>
                {
                    tags && tags.map( tag => (
                      <li key={String(tag.id)}>
                        <ButtonText 
                          title={tag.name}
                          onClick={() => handleTagSelected(tag.name)}
                          $isactive ={tagsSelected.includes(tag.name)}
                        />
                      </li>    
                    ))
                }

            </Menu>

            <Search>
                <Input 
                    placeholder="Pesquisar pelo título" 
                    onChange={(e) => setSearch(e.target.value)}    
                />
            </Search>

            <Content>
                <Section title="Minhas notas">
                    {
                        notes.map(note => (
                            <Note
                            key={String(note.id)}
                            data={note}
                            onClick={() => handleDetails(note.id)}
                            />
                            ))
                        }
                </Section>
            </Content>
            
            <NewNote to="/new">
                <FiPlus />
                Criar Nota
            </NewNote>

        </Container>
    );
}