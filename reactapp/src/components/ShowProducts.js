import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';

const ShowProducts = () => {
    const url = 'https://paginas-web-cr.com/ucr/multimedios0124/ApiBVJ/productos/index.php';
    const [products, setProducts] = useState([]);
    const [idProductos, setidProductos] = useState('');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [estado, setEstado] = useState('');
    const [creado_por, setCreadoPor] = useState('');
    const [modificado_por, setModificadoPor] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const respuesta = await axios.get(url);
        setProducts(respuesta.data);
    }

    const openModal = (op, id, nombre, descripcion, precio, proveedor_id, estado, creado_por, modificado_por) => {
        setidProductos('');
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setProveedor('');
        setEstado('');
        setCreadoPor('');
        setModificadoPor('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Producto');
        } else if (op === 2) {
            setTitle('Editar Producto');
            setidProductos(id);
            setNombre(nombre);
            setDescripcion(descripcion);
            setPrecio(precio);
            setProveedor(proveedor_id);
            setEstado(estado);
            setCreadoPor(creado_por);
            setModificadoPor(modificado_por);
        }
        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = () => {
        var parametros;
        var metodo;
        if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del producto', 'warning');
        } else if (descripcion.trim() === '') {
            show_alerta('Escribe la descripción del producto', 'warning');
        } else if (precio === '') {
            show_alerta('Escribe el precio del producto', 'warning');
        } else {
            if (operation === 1) {
                parametros = {
                    nombre: nombre.trim(),
                    descripcion: descripcion.trim(),
                    precio: precio,
                    proveedor_id: proveedor,
                    estado: estado,
                    creado_por: creado_por,
                    modificado_por: modificado_por
                };
                metodo = 'POST';
            } else {
                parametros = {
                    idProductos: idProductos,
                    nombre: nombre.trim(),
                    descripcion: descripcion.trim(),
                    precio: precio,
                    proveedor_id: proveedor,
                    estado: estado,
                    creado_por: creado_por,
                    modificado_por: modificado_por
                };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }

    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getProducts();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error');
                console.log(error);
            });
    }

    const deleteProduct = (idProductos, nombre) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar el producto ' + nombre + ' ?',
            icon: 'question', 
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true, 
            confirmButtonText: 'Si, eliminar', 
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setidProductos(idProductos);
                axios.delete(url, { data: { idProductos: idProductos } })
                    .then(response => {
                        show_alerta('Producto eliminado correctamente', 'success');
                        getProducts();
                    })
                    .catch(error => {
                        show_alerta('Error al eliminar el producto', 'error');
                    });
            } else {
                show_alerta('El producto NO fue eliminado', 'info');
            }
        });
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-5'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark mt-5' data-bs-toggle='modal' data-bs-target='#modalProducts'>
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
                                    <tr><th>#</th><th>PRODUCTO</th><th>DESCRIPCION</th><th>PRECIO</th><th>PROVEEDOR</th>
                                    <th>ESTADO</th><th>CREADO POR</th><th>MODIFICADO POR</th><th>ACCIONES</th></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {products.map((product, i) => (
                                        <tr key={product.idProductos}>
                                            <td>{(i + 1)}</td>
                                            <td>{product.nombre}</td>
                                            <td>{product.descripcion}</td>
                                            <td>{new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(product.precio)}</td>
                                            <td>{product.proveedor_id}</td>
                                            <td>{product.estado}</td>
                                            <td>{product.creado_por}</td>
                                            <td>{product.modificado_por}</td>
                                            <td>
                                                <button onClick={() => openModal(2, product.idProductos, product.nombre, product.descripcion, product.precio, product.proveedor_id, product.estado, product.creado_por, product.modificado_por)}
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                    <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteProduct(product.idProductos, product.nombre)} className='btn btn-danger'>
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
            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='idProductos'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='descripcion' className='form-control' placeholder='Descripcion' value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-money-bill-1-wave'></i></span>
                                <input type='text' id='precio' className='form-control' placeholder='Precio' value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-box'></i></span>
                                <input type='text' id='proveedor' className='form-control' placeholder='Proveedor' value={proveedor}
                                    onChange={(e) => setProveedor(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-thumbs-up'></i></span>
                                <input type='text' id='estado' className='form-control' placeholder='Estado' value={estado}
                                    onChange={(e) => setEstado(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-user'></i></span>
                                <input type='text' id='creado_por' className='form-control' placeholder='Creado por' value={creado_por}
                                    onChange={(e) => setCreadoPor(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-regular fa-user'></i></span>
                                <input type='text' id='modificado_por' className='form-control' placeholder='Modificado por' value={modificado_por}
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
    )
}

export default ShowProducts;