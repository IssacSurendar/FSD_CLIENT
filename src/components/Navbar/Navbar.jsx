import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Optional: for routing
import checkUserIsLoggedIn, { handleUserLogout } from '../../utils/auth';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import * as Icon from 'react-bootstrap-icons';
import './Navbar.css'
import logo from '../../assets/logo.png'


function CustomNavbar() {

    const {user} = useSelector((state) => state.auth)

    const navigate = useNavigate()

    const [logoutRedirect, setLogoutRedirect] = useState(false)


    useEffect(() => {
      if(logoutRedirect == true){
        navigate("")
        setLogoutRedirect(false)
      }
    }, [logoutRedirect])

    return (
      <Navbar bg="primary" className='mb-3' data-bs-theme="dark" >
        <Container>
            <Navbar.Brand className='py-0'>
              <Nav.Link as={Link} to="/">
              <img src={logo} width="85px" alt="df"/>
              </Nav.Link>
            </Navbar.Brand>

            
              { 
                user ? (
                  <Nav className="ms-auto">
                    {
                      user?.role == 'Admin' ? (
                        <Nav.Link  as={Link} to="/project"><Icon.SuitcaseLg/> Project</Nav.Link>
                      ) : (
                        ''
                      )
                    }
                    {
                      user?.role == 'Admin' ? (
                        <Nav.Link  as={Link} to="/user"><Icon.PeopleFill/> User</Nav.Link>
                      ) : (
                        ''
                      )
                    }

                    <NavDropdown title="Profile" id="basic-nav-dropdown">
                      <NavDropdown.Item className='profile' as={Link} to="">
                        <Row>
                          <Col className='profileTab'>
                            <img width="50px" src={user?.picture}/>
                            <div>{user.username}<br/><small>{user.email}</small></div>
                              
                          </Col>
             
                        </Row>
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/logout" ><Icon.BoxArrowLeft/> Logout</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                ) :(
                  <Nav className="ms-auto">
                    <Nav.Link  as={Link} to="/login"><Icon.BoxArrowInRight/> Login</Nav.Link>
                  </Nav>
                )
              }
                  {/* </Col>
            <Col>
              <div >
                { 
                  user ? (
                    <Container>
                      {
                        user?.role == 'Admin' ? (
                          <div>
                            <Nav.Link  as={Link} to="/project">
                              Project
                            </Nav.Link>
                            <Nav.Link  as={Link} to="/user">
                              User
                            </Nav.Link>
                          </div>
                        ) : (
                          ''
                        )
                      }
                      <Nav.Link  as={Link} to="/login" >
                        <Row>
                          <Col>
                            <img width="50px" src={user?.picture}/>
                          </Col>
                          <Col>
                              <div>{user.username}</div>
                              <small>{user.email}</small>
                          </Col> 
                        </Row>
                      </Nav.Link>
                      
                      {/* <Nav.Link as={Link} to="/logout" >
                        Logout
                      </Nav.Link> 
                    </Container>
                  ) : (
                    <Nav.Link  as={Link} to="/login">
                      Login
                    </Nav.Link>
                  ) 
                }

              </div>
            </Col>
          </Row> */}

        </Container>
      </Navbar>
    );
}

export default CustomNavbar;