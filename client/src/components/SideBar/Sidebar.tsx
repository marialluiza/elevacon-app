import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useNavigate } from 'react-router-dom';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ExpandLess from '@mui/icons-material/ArticleOutlined';
import ExpandMore from '@mui/icons-material/ArticleOutlined';
import { FileInput, FileOutput } from 'lucide-react';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from '../../infra/context/AuthProvider';
import { Collapse, Tooltip } from '@mui/material';

interface MiniDrawerProps {
  toggleSidebar: () => void;
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  backgroundColor: theme.palette.primary.main,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.primary.main,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function MiniDrawer({ toggleSidebar }: MiniDrawerProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { logout, userRole } = useAuth();
  const [documentosOpen, setDocumentosOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
    toggleSidebar();
  };

  const handleDrawerClose = () => {
    setOpen(false);
    toggleSidebar();
  };

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  const handleDocumentosClick = () => {
    setDocumentosOpen(!documentosOpen);
  };

  const mainItems = [
    { text: 'Pagina Inicial', route: '/PaginaInicial', icon: <GridViewOutlinedIcon /> },
    ...(userRole === "CONTADOR"
      ? [{ text: 'Clientes', route: '/ListaCliente', icon: <PeopleAltOutlinedIcon /> }]
      : []),
    {
      text: 'Documentos',
      icon: <ArticleOutlinedIcon />,
      children: [
        { text: 'Recebidos', route: '/ListaDocumento', icon: <FileOutput size={20} /> },
        { text: 'Enviados', route: '/ListaDocumentosEnviados', icon: <FileInput size={20} /> },
        ...(userRole === "CONTADOR"
          ? [{ text: 'Tipos de documentos', route: '/ListarTiposDocumentos', icon: <PictureAsPdfOutlinedIcon /> }]
          : []),
      ],
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[{ marginRight: 5 }, open && { display: 'none' }]}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            Elevacon
          </Typography> */}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open && (
            <Typography variant="h6" sx={{ color: 'white', marginLeft: 1.6, flexGrow: 1, textAlign: 'left' }}>
              Elevacon
            </Typography>
          )}
          <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {mainItems.map((item) => (
            <React.Fragment key={item.text}>
              {!item.children ? (
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <Link to={item.route} style={{ textDecoration: 'none' }}>
                    <Tooltip title={item.text} placement="right">
                      <ListItemButton
                        sx={[
                          { minHeight: 48, px: 2.5 },
                          open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                        ]}
                      >
                        <ListItemIcon
                          sx={[
                            { minWidth: 0, justifyContent: 'center' },
                            open ? { mr: 3 } : { mr: 'auto' },
                            { color: theme.palette.primary.main },
                          ]}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={[
                            open ? { opacity: 1 } : { opacity: 0 },
                            { color: theme.palette.primary.main },
                          ]}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </Link>
                </ListItem>
              ) : (
                <>
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                      onClick={handleDocumentosClick}
                      sx={[
                        { minHeight: 48, px: 2.5 },
                        open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                      ]}
                    >
                      <ListItemIcon
                        sx={[
                          { minWidth: 0, justifyContent: 'center' },
                          open ? { mr: 3 } : { mr: 'auto' },
                          { color: theme.palette.primary.main },
                        ]}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={[
                          open ? { opacity: 1 } : { opacity: 0 },
                          { color: theme.palette.primary.main },
                        ]}
                      />
                      {open ? (documentosOpen ? <ExpandLess /> : <ExpandMore />) : null}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={documentosOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem key={child.text} disablePadding sx={{ display: 'block' }}>
                          <Link to={child.route} style={{ textDecoration: 'none' }}>
                            <Tooltip title={child.text} placement="right">
                              <ListItemButton
                                sx={[
                                  { minHeight: 48, pl: open ? 4 : 2.5 },
                                  open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                                ]}
                              >
                                <ListItemIcon
                                  sx={[
                                    { minWidth: 0, justifyContent: 'center' },
                                    open ? { mr: 3 } : { mr: 'auto' },
                                    { color: theme.palette.primary.main },
                                  ]}
                                >
                                  {child.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={child.text}
                                  sx={[
                                    open ? { opacity: 1 } : { opacity: 0 },
                                    { color: theme.palette.primary.main },
                                  ]}
                                />
                              </ListItemButton>
                            </Tooltip>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider />
        <List>
          {[
            ...(userRole === "CLIENTE"
              ? [{ text: 'Informações pessoais', route: '/VisualizarClienteCliente', icon: <PermContactCalendarOutlinedIcon /> }]
              : []),
            { text: 'Dados de acesso', route: '/EditarPerfil', icon: <AccountCircleOutlinedIcon /> },
            { text: 'Ajuda', route: '/Ajuda', icon: <LiveHelpOutlinedIcon /> },
            {
              text: 'Sair',
              route: '/Login', // A rota será usada apenas para o redirecionamento após o logout
              icon: <LogoutOutlinedIcon />,
              action: handleLogout, // Define a função de logout para o item "Sair"
            },
          ].map(({ text, route, icon, action }, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              {action ? (
                // Para o botão "Sair", apenas a função de logout será chamada
                <Tooltip title={text} placement="right">
                  <ListItemButton
                    sx={[
                      { minHeight: 48, px: 2.5 },
                      open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                    ]}
                    onClick={action}
                  >
                    <ListItemIcon
                      sx={[
                        { minWidth: 0, justifyContent: 'center' },
                        open ? { mr: 3 } : { mr: 'auto' }, { color: theme.palette.primary.main },
                      ]}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={[open ? { opacity: 1 } : { opacity: 0 }, { color: theme.palette.primary.main }]} />
                  </ListItemButton>
                </Tooltip>
              ) : (
                // Para os outros botões, envolvemos com o componente Link
                <Link to={route} style={{ textDecoration: 'none' }}>
                  <Tooltip title={text} placement="right">
                    <ListItemButton
                      sx={[
                        { minHeight: 48, px: 2.5 },
                        open ? { justifyContent: 'initial' } : { justifyContent: 'center' },
                      ]}
                    >


                      <ListItemIcon
                        sx={[
                          { minWidth: 0, justifyContent: 'center' },
                          open ? { mr: 3 } : { mr: 'auto' }, { color: theme.palette.primary.main },
                        ]}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} sx={[open ? { opacity: 1 } : { opacity: 0 }, { color: theme.palette.primary.main }]} />
                    </ListItemButton>
                  </Tooltip>
                </Link>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          marginTop: `${theme.mixins.toolbar.minHeight}px`,
        }}
      >
      </Box>
    </Box>
  );
}
