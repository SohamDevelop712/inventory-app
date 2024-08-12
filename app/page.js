'use client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Snackbar from '@mui/material/Snackbar';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddIcon from '@mui/icons-material/Add';
import Image from "next/image";
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Alert, Box, Button, Fab, IconButton, Modal, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, query, setDoc, getDocs, getFirestore, onSnapshot } from "firebase/firestore";
import { Add, BorderAllRounded, Margin, Mms, SearchRounded } from '@mui/icons-material';
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#000',
  border: '2px solid #e0e1dd',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  color: "#e0e1dd"
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [openSnack,setOpenSnack] = useState(false)
  const [itemQuan,setItemQuan] = useState(1)
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState(0)
  const [visb, setVisb] = useState("")

  

  const handlemsg = () => {
    if (msgType === 0) {
      setMsg("Please Name Your Item")
      
    } else if (msgType === 1) {
      setMsg("Please Enter Value Above 0")
    }
  }

  const handleSnackOpen = () => {
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    if (inventoryList.length === 0) {
      setVisb("visible")
    }else{
      setVisb("hidden")
    }
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: itemQuan })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()    
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor="#0d1b2a"
    >
      <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleSnackClose}>
        <Alert
          onClose={handleSnackClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {msg}
        </Alert>
      </Snackbar>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} width={{xs:300, sm:400, md:400}} bgcolor="#0d1b2a" borderRadius={3}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color={'#e0e1dd'}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2} sx={{color:'#e0e1dd'}}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiInputLabel-root': {
                color: '#e0e1dd', // Change the label color here
                },
                input: { color: '#e0e1dd' }, // Changes the text color
                '& .MuiOutlinedInput-root': { // Targets the outline
                  '& fieldset': {
                    borderColor: '#e0e1dd', // Changes the border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#023e8a', // Changes the border color on hover
                  },
                },
              }}
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-number"
              label="Quantity"
              fullWidth
              required
              type="number"
              sx={{
                '& .MuiInputLabel-root': {
                color: '#e0e1dd', // Change the label color here
                },
                input: { color: '#e0e1dd' }, // Changes the text color
                '& .MuiOutlinedInput-root': { // Targets the outline
                  '& fieldset': {
                    borderColor: '#e0e1dd', // Changes the border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#023e8a', // Changes the border color on hover
                  },
                },
              }}
              defaultValue="1"
              InputLabelProps={{
                shrink: true,
              }}
              value={itemQuan}
              onChange={(e) => setItemQuan(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (itemName === "") {
                  setMsgType(0)
                  handlemsg()
                  handleSnackOpen()
                } else if (itemQuan < 1) {
                  setMsgType(1)
                  handlemsg()
                  handleSnackOpen()
                } else {
                  addItem(itemName)
                  setItemName('')
                  setItemQuan(1)
                  handleClose()
                }
                
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="100vw">
        <Box
          fullWidth
          height="10vh"
          bgcolor={'#023e8a'}
          display={'flex'}
          justifyContent="center"
          alignItems={'center'}
          flexDirection="row"
          p={2}
          color="#e0e1dd"
          sx={{
            borderBottomLeftRadius:30,
            borderBottomRightRadius:30,
            boxShadow:20
          }}
          >
          <Inventory2TwoToneIcon sx={{mr:1}} fontSize='large'/>
          <Typography variant={'h4'} color={'#e0e1dd'} textAlign={'center'} fontFamily="monospace" fontStyle="oblique" fontWeight="1000">
            INVENMAN
          </Typography>
        </Box>
        <Fab variant="extended" onClick={handleOpen} color='primary' sx={{position:"absolute", bottom:"25px", right:"25px" ,color:"#e0e1dd"}}>
          <AddIcon sx={{ mr: 1 }} />
          Add Item
        </Fab>
        
        <Typography textAlign="center" variant='h4' color="#376195" sx={{position:"absolute", bottom:"45%", right: "29%" }} visibility={visb} zIndex="0">
              Click &quot;+ ADD ITEM&quot; Button to Add Item
        </Typography>

        <Stack fullWidth height="90vh" spacing={2} overflow={'auto'} direction={"row"} p={2} bgcolor="#0d1b2a">
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="300px"
              height="100%"
              display={"flex"}
              justifyContent={'center'}
              spacing={5}
              alignItems={"center"}
              bgcolor={'#1b263b'}
              paddingX={5}
              flexDirection="column"
              borderRadius={2}
              boxShadow={5}
              zIndex="2"
            >
              <Box width="100%" justifyContent="space-between" spacing={5} alignContent="center" display="flex" flexDirection="column" >
                <Typography variant={'h2'} color={'#e0e1dd'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h5'} color={'#e0e1dd'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
              </Box>
              <Box width="100%" justifyContent="space-between" alignContent="center" display="flex" flexDirection="row" >
                <Tooltip title="Add"><IconButton variant="contained" onClick={() => addItem(name)} sx={{color:"#e0e1dd"}}><AddIcon/></IconButton></Tooltip>
                <Tooltip title="Remove"><IconButton variant="contained" onClick={() => removeItem(name)} sx={{color:"#e0e1dd"}}><ClearIcon/></IconButton></Tooltip>
              </Box>
              <Button title="Remove All"
                onClick={() => {
                  deleteDoc(doc(collection(firestore, 'inventory'), name))
                  updateInventory()
                }}
                fullWidth
                variant='outlined'
                ><DeleteRoundedIcon sx={{mr: 1}}/>Remove All</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
