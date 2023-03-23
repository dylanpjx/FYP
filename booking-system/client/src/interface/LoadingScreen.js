import {
  Typography,
  Backdrop,
  Box,
  CircularProgress
} from '@mui/material';

const LoadingScreen = ( {loading} ) => {
  return (
    <div>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress color='inherit'/>
                <Box
                    sx={{
                    top: 60,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                >
                    <Typography variant="subtitle1" component="div" color="#F5F5F5">
                        {`Loading`}
                    </Typography>
                </Box>
            </Box>
        </Backdrop>
    </div>
  )
}

export default LoadingScreen
