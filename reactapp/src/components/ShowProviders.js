import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowProviders = () => {
    const url = 'https://paginas-web-cr.com/ucr/multimedios0124/ApiBVJ/proveedor/index.php';
    const [providers, setProviders] = useState([]);
    const [idProveedores, setIdProveedores] = useState('');
    const [nombre, setNombre] = useState('');
    const [contacto, setContacto] = useState('');
    const [direccion, setDireccion] = useState('');
    const [creado_por, setCreadoPor] = useState('');
    const [modificado_por, setModificadoPor] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getProviders();
    }, []);

    const getProviders = async () => {
        const response = await axios.get(url);
        setProviders(response.data);
    }

    const openModal = (op, id, nombre, contacto, direccion, creado_por, modificado_por) => {
        setIdProveedores('');
        setNombre('');
        setContacto('');
        setDireccion('');
        setCreadoPor('');
        setModificadoPor('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Proveedor');
        } else if (op === 2) {
            setTitle('Editar Proveedor');
            setIdProveedores(id);
            setNombre(nombre);
            setContacto(contacto);
            setDireccion(direccion);
            setCreadoPor(creado_por);
            setModificadoPor(modificado_por);
        }
        window.setTimeout(() => {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = () => {
        let parametros;
        let metodo;
        if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del proveedor', 'warning');
        } else if (contacto.trim() === '') {
            show_alerta('Escribe el contacto del proveedor', 'warning');
        } else if (direccion.trim() === '') {
            show_alerta('Escribe la dirección del proveedor', 'warning');
        } else {
            if (operation === 1) {
                parametros = {
                    nombre: nombre.trim(),
                    contacto: contacto.trim(),
                    direccion: direccion.trim(),
                    creado_por: creado_por,
                    modificado_por: modificado_por
                };
                metodo = 'POST';
            } else {
                parametros = {
                    idProveedores: idProveedores,
                    nombre: nombre.trim(),
                    contacto: contacto.trim(),
                    direccion: direccion.trim(),
                    creado_por: creado_por,
                    modificado_por: modificado_por
                };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }

    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros })
            .then(response => {
                const tipo = response.data[0];
                const msj = response.data[1];
                show_alerta(msj, tipo);
                if (tipo === 'success') {
                    document.getElementById('btnCerrar').click();
                    getProviders();
                }
            })
            .catch(error => {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteProvider = (idProveedores, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el proveedor ' + nombre + ' ?',
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setIdProveedores(idProveedores);
                axios.delete(url, { data: { idProveedores: idProveedores } })
                    .then(response => {
                        show_alerta('Proveedor eliminado correctamente', 'success');
                        getProviders();
                    })
                    .catch(error => {
                        show_alerta('Error al eliminar el proveedor', 'error');
                    });
            } else {
                show_alerta('El proveedor NO fue eliminado', 'info');
            }
        });
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-5'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark mt-5' data-bs-toggle='modal' data-bs-target='#modalProviders'>
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
                                    <tr><th>#</th><th>PROVEEDOR</th><th>CONTACTO</th><th>DIRECCIÓN</th><th>CREADO POR</th><th>MODIFICADO POR</th><th>ACCIONES</th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {providers.map((provider, i) => (
                                        <tr key={provider.idProveedores}>
                                            <td>{(i + 1)}</td>
                                            <td>{provider.nombre}</td>
                                            <td>{provider.contacto}</td>
                                            <td>{provider.direccion}</td>
                                            <td>{provider.creado_por}</td>
                                            <td>{provider.modificado_por}</td>
                                            <td>
                                                <button onClick={() => openModal(2, provider.idProveedores, provider.nombre, provider.contacto, provider.direccion, provider.creado_por, provider.modificado_por)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProviders'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteProvider(provider.idProveedores, provider.nombre)} className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalProviders' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='idProveedores'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-industry'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-envelope'></i></span>
                                <input type='text' id='contacto' className='form-control' placeholder='Contacto' value={contacto}
                                    onChange={(e) => setContacto(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-location-dot'></i></span>
                                <input type='text' id='direccion' className='form-control' placeholder='Dirección' value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='creado_por' className='form-control' placeholder='user id' value={creado_por}
                                    onChange={(e) => setCreadoPor(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-regular fa-user'></i></span>
                                <input type='text' id='modificado_por' className='form-control' placeholder='user id' value={modificado_por}
                                    onChange={(e) => setModificadoPor(e.target.value)}></input>
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
    );
}

export default ShowProviders;
