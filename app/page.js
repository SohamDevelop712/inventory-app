'use client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import AddIcon from '@mui/icons-material/Add';
import Image from "next/image";
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, IconButton, Modal, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, query, setDoc, getDocs } from "firebase/firestore";
import { Add, BorderAllRounded, Margin } from '@mui/icons-material';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '0d1b2a',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
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
      bgcolor="0d1b2a"
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-number"
              label="Quantity"
              type="number"
              defaultValue="1"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
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
          justifyContent="space-between"
          alignItems={'center'}
          flexDirection="row"
          p={2}
          color="#e0e1dd"
          >
          <Inventory2TwoToneIcon fontSize='large'/>
          <Typography variant={'h4'} color={'#e0e1dd'} textAlign={'center'} fontFamily="monospace" fontStyle="oblique" fontWeight="1000">
            INVEN
          </Typography>
          <Tooltip title="Add Item">
            <IconButton aria-label='Add Item' onClick={handleOpen} size='large' sx={{color:"#e0e1dd"}}>
            <AddIcon fontSize='inherit'/>
            </IconButton>
          </Tooltip>
        </Box>
        <Stack fullWidth height="90vh" spacing={2} overflow={'auto'} direction={"row"} p={2} bgcolor="#0d1b2a">
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="30vw"
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
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
