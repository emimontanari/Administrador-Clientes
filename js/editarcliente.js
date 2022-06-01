(function(){
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded',()=>{
        conectarDB();

        formulario.addEventListener('submit', actualizarCliente);
        //Verificar el id de la url
        const parametrosURL = new URLSearchParams(window.location.search);

        idCliente = parametrosURL.get('id');

        if(idCliente){

            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        };
    });

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');
        
        const cliente = objectStore.openCursor();
        cliente.onsuccess = e=>{
            const cursor = e.target.result;

            if(cursor){
                
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    };

    function llenarFormulario(datosClientes){
        const {nombre,email,telefono,empresa} = datosClientes;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;



    };

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            return;
        };

        //Actualizar el cliente

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresaInput: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        };
        const transaction = DB.transaction(['crm'],'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = () =>{
            imprimirAlerta('Editado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 1000);
        };

        transaction.onerror = ()=>{
            imprimirAlerta('Hubo un error', 'error');
        };

    }
    function conectarDB(){

        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        };
    };

})();