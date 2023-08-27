import './App.css';
import { Card, Button, Form, ListGroup, InputGroup, Toast } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cocktail, setCocktail] = useState({
    name: "",
    image: "",
    instructions: "",
    ingredients: [],
    measures: []
  });
  const [showError, setShowError] = useState(false);
  const searchedCocktailName = useRef();

  const getCocktailRandom = async () => {
    const newCocktail = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then(x => { return x.data });
    setCocktail({
      name: newCocktail.drinks[0].strDrink,
      image: newCocktail.drinks[0].strDrinkThumb,
      instructions: newCocktail.drinks[0].strInstructions,
      ingredients: Object.keys(newCocktail.drinks[0])
        .filter(x => x.includes("strIngredient"))
        .filter(x => newCocktail.drinks[0][x] !== null && newCocktail.drinks[0][x] !== "").map(x => newCocktail.drinks[0][x]),
      measures: Object.keys(newCocktail.drinks[0])
        .filter(x => x.includes("strMeasure"))
        .filter(x => newCocktail.drinks[0][x] !== null && newCocktail.drinks[0][x] !== "").map(x => newCocktail.drinks[0][x])
    });
    searchedCocktailName.current.value = "";
  };

  const getCocktailWithSearch = async (e) => {
    try {
      const newCocktail = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchedCocktailName.current.value.replace(" ", "%20").toLocaleLowerCase()}`)
        .then(x => { return x.data });
      setCocktail({
        name: newCocktail.drinks[0].strDrink,
        image: newCocktail.drinks[0].strDrinkThumb,
        instructions: newCocktail.drinks[0].strInstructions,
        ingredients: Object.keys(newCocktail.drinks[0])
          .filter(x => x.includes("strIngredient"))
          .filter(x => newCocktail.drinks[0][x] !== null && newCocktail.drinks[0][x] !== "").map(x => newCocktail.drinks[0][x]),
        measures: Object.keys(newCocktail.drinks[0])
          .filter(x => x.includes("strMeasure"))
          .filter(x => newCocktail.drinks[0][x] !== null && newCocktail.drinks[0][x] !== "").map(x => newCocktail.drinks[0][x])
      });
    }

    catch {
      setShowError(true);
    }

    searchedCocktailName.current.value = "";
  }

  useEffect(() => {
    getCocktailRandom();
  }, []);

  return (
    <div className='d-flex flex-column' style={{ minHeight: "100vh" }}>
      <div className='d-flex justify-content-center'>
        <div className='col-sm-8 col-md-7 col-lg-4 col-10 py-4 position-relative'>
          <InputGroup>
            <Form.Control type='text' placeholder='Write Here...' ref={searchedCocktailName} />
            <Button onClick={getCocktailWithSearch}>Search</Button>
          </InputGroup>
          <Toast onClose={() => setShowError(false)} show={showError} autohide className='mt-3 mx-auto'>
            <Toast.Header className='fw-bold d-flex justify-content-between'>Error</Toast.Header>
            <Toast.Body className='bg-warning'>Not Found</Toast.Body>
          </Toast>
          <Card className='border border-2 border-primary mt-3'>
            <Card.Img src={cocktail.image} variant='top' />
            <Card.Body>
              <Card.Title className='text-center'>{cocktail.name}</Card.Title>
              <Card.Text className='border border-1 rounded-2 p-2'>{cocktail.instructions}</Card.Text>
              <ListGroup as='ul' numbered>
                {
                  cocktail.ingredients.map((ingredient, index) => {
                    return (
                      <ListGroup.Item as='li' key={index} className='p-2'>
                        {ingredient}{cocktail.measures[index] && ` ( ${cocktail.measures[index]} )`}
                      </ListGroup.Item>
                    );
                  })
                }
              </ListGroup>
            </Card.Body>
          </Card>
          <div className='d-flex justify-content-center mt-3'>
            <Button onClick={getCocktailRandom}>Get Random</Button>
          </div>

        </div>
      </div>
      <footer className='d-flex align-items-center justify-content-center bg-primary-subtle mt-auto mb-0 w-100 py-3' style={{ height: '100%' }}>
        <span className='text-dark me-2'>Developed by Piyar Emen</span>
        <a href="https://www.linkedin.com/in/piyaremen/" className='text-decoration-none text-dark me-2' target='_blank'><img src="linkedin.png" style={{height: '20px'}}/></a>
        <a href="https://github.com/piyar-emen" className='text-decoration-none text-dark' target='_blank'><img src="github.png" className='border rounded-1' style={{height: '20px'}}/></a>
      </footer>

    </div>
  );
}

export default App;
