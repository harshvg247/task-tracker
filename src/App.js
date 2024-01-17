import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {

  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('list')));
  const [statusFilter, setStatusFilter] = useState("all");

  // local storage
  useEffect(() => {
    let newTasks = [];
    if(JSON.parse(localStorage.getItem('list'))){
      newTasks = JSON.parse(localStorage.getItem('list'))
    }
    setTasks(newTasks);
  }, []);
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(tasks));
  }, [tasks]);

  let filteredTask = [];
  if(tasks){
    filteredTask = tasks.filter((task)=>{
      if(statusFilter=="all"){
        return true;
      }else{
        return task.status===statusFilter;
      }
    })  
  }

  function updateStatus(_id) {
    let newTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === _id) {
        if (tasks[i].status === "Completed") {
          newTasks.push({ ...tasks[i], status: "Pending" });
        } else {
          newTasks.push({ ...tasks[i], status: "Completed" });
        }
      } else {
        newTasks.push(tasks[i]);
      }
    }
    setTasks(newTasks);

  }

  function handleDelete(_id) {
    setTasks(tasks.filter((task) => {
      return task.id !== _id;
    }))
  }

  function handleNew() {
    let name = document.getElementById("Form-text").value;
    if (!name) {
      return;
    }
    let date = new Date();
    date = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();
    let newTasks = [];
    tasks.forEach((task) => {
      newTasks.push(task);
    })
    newTasks.push({ "name": name, "date": date, "status": "Pending", "id": uuidv4() });
    setTasks(newTasks);
    document.getElementById("Form-text").value = "";
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    console.log(result);
    let newTasks = [];
    tasks.forEach((task) => {
      newTasks.push(task);
    })

    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    setTasks(newTasks);

  }

  function handleFilter(e){
    // const elems = document.getElementsByClassName(e.target.value);
    // console.log(elems);
    // const elemsAll = document.getElementsByClassName("pending Card-body");
    // for(let i=0;i<elemsAll.length;i++){
    //   elemsAll[i].classList.add("hide");  
    // }
    // for(let i=0;i<elems.length;i++){
    //   elems[i].classList.remove("hide");  
    // }
  }

  return (
    <>

      <div className="addTask">
        <textarea rows="4" cols="30" id="Form-text" placeholder="Add your text here..."></textarea>
        <button className="addButton" onClick={handleNew}>Add</button>
        <select id="status" name="status" onChange={(e)=>{setStatusFilter(e.target.value)}}>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="all" selected>All</option>
        </select>
      </div>


      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <div className="cards" ref={provided.innerRef}>
              {filteredTask.map((task, index) => {
                let statustext = "Mark Complete";
                if (task.status === "Completed") {
                  statustext = "Mark pending";
                }
                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div className={task.status === "Completed" ? "completed Card-body" : "pending Card-body"} {...provided.draggableProps}{...provided.dragHandleProps}{...provided.dragHandleProps} ref={provided.innerRef}>
                        <div className="Card-date">{task.date}</div>
                        <div className="Card-name">{task.name}</div>
                        <div className="Card-bottom"><span>{task.status}</span>
                          <span>
                            <button className="statusButton" onClick={() => { updateStatus(task.id) }}>{statustext}</button></span>
                          <span><button className="deleteButton" onClick={() => { handleDelete(task.id) }}><i class="fa-solid fa-trash-can fa-lg"></i></button></span></div>

                      </div>
                    )}

                  </Draggable>)
              })}
              {provided.placeholder}
            </div>
          )}

        </Droppable>
      </DragDropContext>

    </>
  );
}

export default App;
