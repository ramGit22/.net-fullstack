//get data show div 
const eventData=document.getElementById('event-data')


//save event function 
document.getElementById('save-event-button').addEventListener('click',(e)=>{
    //get data from add new event form 
const monitorEvent=document.getElementById('ME1').value
const folderData=document.getElementById('F1').value
const filterData=document.getElementById('Fil1').value
const actionType=document.getElementById('action-type').value
let validate=false
document.getElementById('val1_0').addEventListener('change', ()=>validate=this.checked)
const supportEmail=document.getElementById('SE1').value
    const addEventPayload={  
        Actions: []
     }
    addEventPayload['EventType']=monitorEvent
    addEventPayload['Folder']=folderData
    addEventPayload['Filter'] = filterData

    const action = {
        ActionType: actionType,
        Validate: validate,
        SupportEmail: supportEmail
    }

    addEventPayload.Actions.push(action);

    //call post new api function 
    postNewEventToAPI(addEventPayload)
    
})


  //create event card
  function createEventCard(event, index){
    const item=  `
    <div class="event-card">
    <div class="event-card__content">
      <p>Type <span>${event['xsi:type']}</span></p>
    <p>Folder<span>${event.Folder}</span></p>
    <p>Filter<span>${event.Filter}</span></p>

    <!-- action -->
    <p class="mt-5">Actions</p>
    <div class="action-card">
      <p>Name <span>FileImportAction</span></p>
      <p>Validate <input type="checkbox"  ${event.Actions?.EventAction?.Validate ==='true'?'checked':''}>
      <p>Support Email:<span>${event?.Actions?.EventAction?.SupportEmail}</span></p>
    </div>
    </div>
    <div class="event-card__action">
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#openDialog${index}">Edit</button>
      <button class="btn-danger" id="delete-data-button${index}">Delete</button>
    </div>

    
<!-- Modal -->
<div class="modal fade" id="openDialog${index}" tabindex="-1" role="dialog" aria-labelledby="openDialog${index}Label" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="openDialog${index}Label">Add event </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form style="margin: 150px">
          <div class="form-group row">
            <label for="event-name${index}" class="col-4 col-form-label">Monitor Event</label>
            <div class="col-8">
              <select id="event-name${index}" name="event-name${index}" class="custom-select">
                <option value="FileSystemEvent">FileSystemEvent</option>
                <option value="Database Event">Database Event</option>
                <option value="HttpEvent">HttpEvent</option>
                <option value="FileSystemMaintenanceEvent">
                  FileSystemMaintenanceEvent
                </option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="folder-data${index}" class="col-4 col-form-label">Folder</label>
            <div class="col-8">
              <div class="input-group">
                <input id="folder-data${index}" name="folder-data${index}" type="text" value="${event.Folder}" class="form-control" />
                <div class="input-group-append">
                 
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="filter-data${index}" class="col-4 col-form-label">Filter</label>
            <div class="col-8">
              <div class="input-group">
                <input id="filter-data${index}" name="filter-data${index}" type="text" value="${event.Filter}" class="form-control" />
                <div class="input-group-append">
                  
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="action-data${index}" class="col-4 col-form-label">Choose Action Type</label>
            <div class="col-8">
              <select id="action-data${index}" name="action-data${index}" class="custom-select">
                <option value="FileImportAction">FileImportAction</option>
                <option value="XmlExporter">XmlExporter</option>
                <option value="EntityChangeState">EntityChangeState</option>
                <option value="">WebServiceCall</option>
                <option value="">EntityImport</option>
                <option value="">FolderCleaner</option>
                <option value="">RestRequestAction</option>
                <option value="">ExecutionOperation</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-4">Validate</label>
            <div class="col-8">
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  name="validate${index}"
                  id="validate${index}"
                  type="checkbox"
                  class="custom-control-input"                 
                  ${event.Actions?.EventAction?.Validate==='true'?'checked':''}
                />
                <label for="val1_0" class="custom-control-label"></label>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="support-email${index}" class="col-4 col-form-label">Support Email</label>
            <div class="col-8">
              <input id="support-email${index}" name="support-email${index}" type="text" value="${event?.Actions?.EventAction?.SupportEmail}" class="form-control" />
            </div>
          </div>
         
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal${index}">Cancel</button>
        <button type="button" class="btn btn-primary" id="update-data-button${index}">Save changes</button>
      </div>
    </div>
  </div>
</div>

  </div>
    `

    //get all fields data   and save    
    document.addEventListener('click',function(e){
        if(e.target && e.target.id== `update-data-button${index}`){
            const folderData=document.getElementById(`folder-data${index}`)?.value
            const filterData=document.getElementById(`filter-data${index}`)?.value
            const eventName=document.getElementById(`event-name${index}`)?.value
            const actionData=document.getElementById(`action-data${index}`)?.value
            const validateData=document.getElementById(`validate${index}`)?.value
            const supportEmailData=document.getElementById(`support-email${index}`)?.value

            const supportEmail=document.getElementById('SE1').value
            const updateEventPayload = {
                Actions: []
            };

            updateEventPayload['EventType'] = eventName
            updateEventPayload['Folder'] = folderData
            updateEventPayload['Filter'] = filterData;

            const actionPayload = {
                ActionType: actionData,
                Validate: validateData == "on" ? true: false,
                SupportEmail: supportEmailData
            }
            updateEventPayload.Actions.push(actionPayload);

            //functiion update data 
            updateDataToAPI(index, updateEventPayload);
        }
        
    });

     //delete the current action data
     document.addEventListener('click',function(e){
        if(e.target && e.target.id== `delete-data-button${index}`){
            //call delete api function 

            deleteDataAPI(index);

        }
     });
     return item;
  }



 

//get all data from API 

const fetchDataFromApi=()=>{
  //fetch data form json file
return fetch('/api/configuration') 
  .then(response => response.json())
    .then(data => {
      console.log(data);
        let d = data.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
       d = d.replace(/[\u0000-\u0019]+/g, "");
      const parsed = JSON.parse(d);
      console.log(parsed.ActiveCMSMonitor.MonitorEvent)

      const eventItems = parsed.ActiveCMSMonitor.MonitorEvent.map((event, index) => createEventCard(event, index));
      eventData.innerHTML=eventItems
    
    })
  .catch(error => console.log(error));

  
}

//send update request to API
const updateDataToAPI = async (id,payload)=>{
    //call api update
    console.log("update data to api", id, payload);
    payload.Index = id;

    fetch('/api/configuration',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
        .then(() => console.log("Success"))
        .then(fetchDataFromApi)
        .then(() => {
            document.querySelector(".modal-backdrop").remove();
            document.querySelector("body").classList.remove("modal-open");
        });
}

//delete item from API 
const deleteDataAPI=(id) => {
    fetch(`/api/configuration?index=${id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        .then(fetchDataFromApi)
    
    
}

//post new event 
const postNewEventToAPI=(payload)=> {
    console.log("add new post payload", payload);
    fetch('/api/configuration',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
        .then(res => res.json())
        .then(data => console.log("success"));
}


//call api data
fetchDataFromApi()

