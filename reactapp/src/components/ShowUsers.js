import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowUsers = () => {
    const url = 'https://paginas-web-cr.com/ucr/multimedios0124/ApiBVJ/usuarios/index.php';
    const [users, setUsers] = useState([]);
    const [idUsuarios, setidUsuarios] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const response = await axios.get(url);
        setUsers(response.data);
    }

    const openModal = (op, id, nombre, email, password) => {
        setidUsuarios('');
        setNombre('');
        setEmail('');
        setPassword('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Usuario');
        } else if (op === 2) {
            setTitle('Editar Usuario');
            setidUsuarios(id);
            setNombre(nombre);
            setEmail(email);
            setPassword(password);
        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = () => {
        var parametros;
        var metodo;
        if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del usuario', 'warning');
        } else if (email.trim() === '') {
            show_alerta('Escribe el email del usuario', 'warning');
        } else if (password.trim() === '') {
            show_alerta('Escribe la contraseña del usuario', 'warning');
        } else {
            if (operation === 1) {
                parametros = {
                    nombre: nombre.trim(),
                    email: email.trim(),
                    password: password.trim()
                };
                metodo = 'POST';
            } else {
                parametros = {
                    idUsuarios: idUsuarios,
                    nombre: nombre.trim(),
                    email: email.trim(),
                    password: password.trim()
                };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }

    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros })
            .then(response => {
                var tipo = response.data[0];
                var msj = response.data[1];
                show_alerta(msj, tipo);
                if (tipo === 'success') {
                    document.getElementById('btnCerrar').click();
                    getUsers();
                }
            })
            .catch(error => {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteUser = (idUsuarios, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el usuario ' + nombre + ' ?',
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setidUsuarios(idUsuarios);
                axios.delete(url, { data: { idUsuarios: idUsuarios } })
                    .then(response => {
                        show_alerta('Usuario eliminado correctamente', 'success');
                        getUsers();
                    })
                    .catch(error => {
                        show_alerta('Error al eliminar el usuario', 'error');
                    });
            } else {
                show_alerta('El usuario NO fue eliminado', 'info');
            }
        });
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-5'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark mt-5' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>#</th><th>NOMBRE</th><th>EMAIL</th><th>ACCIONES</th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {users.map((user, i) => (
                                        <tr key={user.idUsuarios}>
                                            <td>{(i + 1)}</td>
                                            <td>{user.nombre}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button onClick={() => openModal(2, user.idUsuarios, user.nombre, user.email, user.password)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalUsers'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteUser(user.idUsuarios, user.nombre)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalUsers' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='idUsuarios'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-envelope'></i></span>
                                <input type='text' id='email' className='form-control' placeholder='Email' value={email}
                                    onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-lock'></i></span>
                                <input type='password' id='password' className='form-control' placeholder='Contraseña' value={password}
                                    onChange={(e) => setPassword(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={() => validar()} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowUsers;
