import './App.css';
import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { React, useEffect, useState } from 'react';

function App() {
  const { isAuthenticated, isSessionLoading } = useSession()
  const { user, isUserLoading } = useUser()
  const { logout } = useDescope()

  const [recipes, setRecipe] = useState([]);

  const exampleFetchCall = async () => {
    await fetch("https://dummyjson.com/recipes")
        .then((response) => response.json())
        .then((results) => {
          setRecipe(results.recipes);
        })
        .catch(error => console.error(error));
  }
  
  useEffect(() => {
    exampleFetchCall();
  }, []);

  const handleLogout = () => {
    logout()
  };

  return <>
    {!isAuthenticated &&
      (
        <Descope
          flowId="sign-up-or-in"
          onSuccess={(e) => console.log(e.detail.user)}
          onError={(e) => console.log('Could not log in!')}
        />
      )
    }

    {
      (isSessionLoading || isUserLoading) && <p>Loading...</p>
    }

    {!isUserLoading && isAuthenticated &&
      (
        <>
          <p>Hello {user.name}</p>
          <button onClick={handleLogout}>Logout</button>
          <div>Here are some delicious recipes:</div>
          {recipes.length > 0 && 
            <>
              {recipes.map((recipe) => {
                return (
                  <div key={recipe.id}>
                    <h1>{recipe.name}</h1>
                    <p>Ingredients: {recipe.ingredients.join(', ')}.</p>
                    {recipe.instructions.map((instruction, index) => {
                      return (<p key={index}>{instruction}</p>)
                    })}
                  </div>
                )
              })}
            </>
          }
        </>
      )}
  </>;
}

export default App;