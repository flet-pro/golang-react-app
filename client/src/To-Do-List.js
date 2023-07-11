import React, {Component} from "react";
import axios from "axios";
import {Card, Header, Form, Input, Icon, CardGroup, CardContent, CardHeader, CardMeta, Button} from "semantic-ui-react";

let endpoint = "http://192.168.0.134:9000";

class ToDoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            items: [],
        };
    }

    componentDidMount() {
        this.getTask();
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    onSubmit = async () => {
        let {task} = this.state;

        const data = {
            task : task,
        };

        if (task){
            await axios.post(endpoint + '/api/tasks', data)
            .then((res) => {
                this.getTask();
                this.setState({
                    task : "",
                });
            })
            .catch((err) => {
                console.error(err);
            })

            // axios.post(endpoint + "/api/tasks",
            //     data,
            //     {
            //         headers : {
            //             "Content-Type" : "application/x-www-form-urlencoded",
            //         },
            //     }
            // ).then((res) => {
            //     this.getTask();
            //     this.setState({
            //         task : "",
            //     });
            //     console.log(res)
            // });
        }
    }

    getTask = () => {
        axios.get(endpoint + "/api/task").then((res) => {
            if (res.data) {
                console.log(res.data)
                this.setState({
                    items: res.data.map((item) => {
                        let color = "yellow";
                        let style = {
                            wordWrap: "break-word",
                        };

                        if (item.status) {
                            color = "green";
                            style["textDecorationLine"] = "line-through";
                            style["textDecorationThickness"] = "17px";
                        }

                        return (
                        <Card
                        key={item._id}
                        color={color}
                        fluid
                        className="rough"
                        >
                            <CardContent>
                                <CardHeader textAlign="left">
                                    <div style={style}>{item.task}</div>
                                </CardHeader>
                                <CardMeta textAlign="right">
                                    <Icon
                                        name="check circle"
                                        color="blue"
                                        onClick={() => this.updateTask(item._id)}
                                    />
                                    <span style={{paddingRight: 10}}>Done</span>
                                    <Icon
                                        name="redo"
                                        color="yellow"
                                        onClick={() => this.undoTask(item._id)}
                                    />
                                    <span style={{paddingRight: 10}}>Undo</span>
                                    <Icon
                                        name="delete"
                                        color="red"
                                        onClick={() => this.deleteTask(item._id)}
                                    />
                                    <span style={{paddingRight: 10}}>delete</span>
                                </CardMeta>
                            </CardContent>
                        </Card>
                        );
                    }),
                });
            }else{
                this.setState({
                    items : [],
                });
            }
        });
    }

    updateTask = (id) => {
        axios.put(endpoint + "/api/tasks/" + id, {
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    }

    undoTask = (id) => {
        axios.put(endpoint + "/api/undoTask/" + id, {
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    }

    deleteTask = (id) => {
        axios.delete(endpoint + "/api/deleteTask/" + id, {
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <Header className="header" as="h2" color="yellow">
                        TO DO LIST
                    </Header>
                </div>
                <div className="row">
                    <Form onSubmit={this.onSubmit}>
                        <Input
                            type="text"
                            name="task"
                            onChange={this.onChange}
                            value={this.state.task}
                            fluid
                            placeholder="Write Task"
                        />
                        <div className="btn">
                            <Button>Create Task</Button>
                        </div>
                    </Form>
                </div>
                <div className="row">
                    <CardGroup>
                        {this.state.items}
                    </CardGroup>
                </div>
            </div>
        )
    }
}

export default ToDoList