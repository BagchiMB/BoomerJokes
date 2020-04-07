import React,{Component} from 'react'
import Joke from './Joke'
import './JokeList.css'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

class JokeList extends Component
{
    static defaultProps ={
        numJokes:10
    }
    constructor(props)
    {
        super(props)
        this.state={jokes: JSON.parse(window.localStorage.getItem("jokes")||"[]"),loading:false}
        this.handleVote=this.handleVote.bind(this)
        this.handleClick=this.handleClick.bind(this)
    }
    async componentDidMount()
    {
        if(this.state.jokes.length === 0)
        {
            this.getJokes()
        }
    }
    async getJokes()
    {
        let res;
        let jokes=[];
        
        while(jokes.length<this.props.numJokes)
        {
            res=await axios.get("https://icanhazdadjoke.com/", {headers:{Accept:"application/json"}})
            
            if(this.state.jokes.length===0)
            {
                jokes.push({id:uuidv4(),joke:res.data.joke,votes:0})
            }
            else
            {
                let flag=0;
                console.log(this.state.jokes.length)
                for (let i = 0; i < this.state.jokes.length; i++) 
                {  
                    if((this.state.jokes[i].joke)===(res.data.joke))
                    {
                        console.log("purana")
                        flag=1
                        console.log(res.data.joke)
                    }
                }
                if(flag===0)
                {
                    jokes.push({id:uuidv4(),joke:res.data.joke,votes:0})
                }
            }
        } 
        this.setState(
            st => ({
                loading:false,
                jokes:[...st.jokes,...jokes]
            }),
            ()=>window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes)))
    }
    handleVote(id,delta)
    {
        let array=[]
        for (let i = 0; i < this.state.jokes.length; i++) 
        {
            if(id===this.state.jokes[i].id)
            {
                array.push({...this.state.jokes[i],votes:this.state.jokes[i].votes+delta})
            }
            else
            {
                array.push({...this.state.jokes[i]})
            } 
        }
        this.setState({jokes:array},()=>window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes)))     
    }
    handleClick()
    {
        this.setState({loading:true},this.getJokes)
    }
    render()
    {
        if(this.state.loading)
        {
            return(
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            );
        }
        else
        {
            let jokes= this.state.jokes.sort((a,b)=> b.votes-a.votes)
            return(
                <div className="JokeList">
                    <div className="JokeList-stylebar">
                        <h1 className="JokeList-title"><span>Boomer</span> Jokes</h1>
                        <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                        <button className="JokeList-getmore" onClick={this.handleClick}>Fetch Jokes</button>
                    </div>
                    
                    <div className="JokeList-jokes">
                        {jokes.map(j =>
                            <Joke id={j.id} v={this.handleVote} key= {j.id} votes={j.votes} text={j.joke}/>)}
                    </div>
                </div>
            );
        }    
    }
}

export default JokeList