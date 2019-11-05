import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios'
import to from "await-to-js"
import './App.css';
const config = require("./config.json")

class App extends Component {
    state = {
        todos:[],
        Item:{
            id:"",
            content:"",
            createAt:""
        }

    }

    componentDidMount(){
        this.listAll()
    }
    handleChange = (event) => {
        this.setState({
            Item:{
                content: event.target.value,
                createAt: new Date()
            }
        })
    }

    listAll = async()=>{
        let [ error, result ] = await to (axios.get(`${config.apiGateway.URL}/todos`))

        if(error){
            console.log('ListAll has error')
        }
        return this.setState({todos:result.data})
    }

    addItem = async(event)=> {
        let { todos, Item } =this.state
        const dataParameters = {
            "content": Item.content,
            "createAt": Item.createAt
        }

        let [ error, result ]= await to(axios.post(`${config.apiGateway.URL}/todos`,dataParameters))

        if(error){
            console.log('addItem has error')
        }

        return this.setState({
            todos: [...todos, result.data],
            Item:  {"id":"", "content":"", "createAt":""}
        })
    }

    deleteItem = async(id)=>{
        const filteredItems = this.state.todos.filter(currentItem => currentItem.id !== id)
        let [error] = await to(axios.delete(`${config.apiGateway.URL}/todos/${id}`))

        if(error){
            console.log('deleteItem has error')
        }

        return this.setState({todos: filteredItems})
    }


    render(){
        const { todos, Item} = this.state
        const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const headerDate = (new Date()).toLocaleDateString('en-US', DATE_OPTIONS)
        return (
            <div className="container">
                <div className="row">
                    <div className="col-10 mx-auto col-md-8 mt=4">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <h1 className="display-4 text-center text-info" >{headerDate}</h1>
                                <h4 className="lead text-center">What's Your Today's Action Piece? </h4>
                            </div>
                        </div>

                        <div>
                            <div className="input-group flex-nowrap">
                                <div className="input-group-prepend">
                                  <span className="input-group-text" id="addon-wrapping">
                                    <i className="fas fa-book-open"></i>
                                </span>
                                </div>
                                <input value={Item.content} className="form-control" placeholder="Add todo"  onChange={this.handleChange}
                                />
                            </div>
                            <br/>

                            <button type ='button' className= 'btn btn-secondary btn-lg btn-block'
                                    onClick={this.addItem}>Add Item</button>
                        </div>

                        <div>
                            <ul className="list-group">
                                <h1 className='text-center'>Action List</h1>
                                {todos.map( (currentItem, index) => {
                                    return(
                                        <li key = {index} className='list-group-item d-flex justify-content-between my-2'>
                                            <h6>{currentItem.content}</h6>
                                            <h6>{currentItem.createAt}</h6>
                                            <div className= 'todo-icon'>
                                                <span className= 'mx-2 text-danger' >
                                                     <i className='fas fa-trash' onClick={()=>this.deleteItem(currentItem.id)}/>
                                                 </span>
                                            </div>
                                        </li>
                                    )}
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            /*<div className = "container">
                <div className ="input-group">
                    <input value = {Item.content} placeholder = "Add Item" onChange={this.handleChange}/>
                    <button type = "button" onClick = {this.addItem}> Add Item </button>
                </div>

                <div className= "list-group">
                    <ul>
                        {
                            todos.map( (currentItem,index)=> {
                            return(
                              <li key = { index } >
                                  <h5>{currentItem.content}</h5>
                                  <h5>{currentItem.createAt}</h5>
                                  <button onClick={()=>this.deleteItem(currentItem.id)}>Delete Item</button>
                              </li>
                            )
                        })
                        }
                    </ul>

                </div>
            </div>*/
        )
    }

}

export default App;
