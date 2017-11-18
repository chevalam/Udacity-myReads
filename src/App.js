import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchBooks from './SearchBooks'
import ListBooks from './ListBooks'
import {Route} from 'react-router-dom'

class BooksApp extends React.Component {
  state = {
    listedbooks: []
  }

  componentDidMount() {
    var {listedbooks} = this.state
    if(listedbooks.length <= 0)
      BooksAPI.getAll().then((list)=>{
        this.setState({listedbooks:list})
      })
  }

  updateShelfMovement = (element)=>{
    BooksAPI.get(element.id).then((book)=>(BooksAPI.update(book,element.value)))
    var {listedbooks} = this.state
    listedbooks.map((book) => {
      if(book.id === element.id)
      book.shelf = element.value
      return book
    })
    this.setState({listedbooks})
  }

 addBooksFromSearchToShelf = (element) =>{
   var {listedbooks} = this.state
   BooksAPI.get(element.id).then((book)=>{
     book.shelf = element.value
     let index = listedbooks.findIndex((bookinshelf)=>{
       return bookinshelf.id === book.id
     })
     if(index === -1 ) { // Not found
     listedbooks.push(book)
    }
     else {
        listedbooks[index].shelf = element.value
     }
     BooksAPI.update(book,element.value)
     this.setState({listedbooks})
   })
 }
  render() {
    var {listedbooks} = this.state

    return (
      <div className="app">
          <div className="list-books">
            <Route
              exact path="/"
              render={()=>(<ListBooks
                shelflist={this.state.listedbooks}
                updateShelfMovement={this.updateShelfMovement}/>)}/>

            <Route
               path="/search"
              render={({history})=>(<SearchBooks
                books={listedbooks}
                addBooksFromSearchToShelf={(element) => {
                  this.addBooksFromSearchToShelf(element)
                  history.push('/')
                }}/>)}
              />

          </div>

      </div>
    )
  }
}

export default BooksApp
