import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#222222',
    },
  },
});

const parallelColors = {
  'Universal': 'white',
  'Earthen': 'green',
  'Shroud': 'purple',
  'Augencore': 'orange',
  'Kathari': 'blue',
  'Marcolian': 'red',

};

const NFTCard = ({ nft }) => {
  const shadowColor = parallelColors[nft.gameData.parallel] || 'default';

  return (
  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: 310, boxShadow: `2px 2px 2px 1px ${shadowColor}` }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CardMedia
          component="img"
          sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          image={nft.media.image}
          alt={nft.name}
        />
      </Box>
        <Table size="small">
          <TableBody>
            <TableRow>
          <TableCell colSpan={4} style={{ textAlign: 'center', fontWeight: 'bold' }}>
            {nft.name}
          </TableCell>
          </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Type</TableCell>
                <TableCell>{nft.gameData.cardType}</TableCell>
                <TableCell component="th" scope="row">Attack</TableCell>
                <TableCell>{nft.gameData.attack}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Subtype</TableCell>
                <TableCell>{nft.gameData.subtype ? nft.gameData.subtype : '-'}</TableCell>
                <TableCell component="th" scope="row">Health</TableCell>
                <TableCell>{nft.gameData.health}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Parallel</TableCell>
                <TableCell>{nft.gameData.parallel}</TableCell>
                <TableCell component="th" scope="row">Cost</TableCell>
                <TableCell>{nft.gameData.cost}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Rarity</TableCell>
                <TableCell>{nft.gameData.rarity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}><Typography variant="body2">Passive<br />{nft.gameData.passiveAbility}</Typography></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}><Typography variant="body2">Function<br />{nft.gameData.functionText}</Typography></TableCell>
              </TableRow>
            </TableBody>
            </Table>

      
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>More details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table size="small">
                  <TableRow>
                    <TableCell component="th" scope="row">Total Supply</TableCell>
                    <TableCell>{nft.metadata.supply}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Paraset</TableCell>
                    <TableCell>{nft.metadata.paraset}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Expansion</TableCell>
                    <TableCell>{nft.metadata.expansion}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Class</TableCell>
                    <TableCell>{nft.metadata.class}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>{nft.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Artist</TableCell>
                    <TableCell>{nft.metadata.artist}</TableCell>
                  </TableRow>
                  <TableRow colSpan={2}>
                    <TableCell>    
                      <Button size="small" color="primary" href={nft.uri} target="_blank">
                        View token metadata
                      </Button>
                    </TableCell>
                  </TableRow>
                </Table>
              </AccordionDetails>
            </Accordion>

    </CardContent>
  </Card>
  );
};

function App() {
  const [nfts, setNfts] = useState([]);
  const [attack, setAttack] = useState({ gte: 5 });
  const [health, setHealth] = useState({ lte: 3 });
  const [cost, setCost] = useState({ gte: 3 });
  const [rarity, setRarity] = useState('');
  const [parallel, setParallel] = useState('');

  const parallels = ["Earthen", "Shroud", "Augencore", "Marcolian", "Kathari", "Universal"];
  const rarities = ["Prime", "Legendary", "Rare", "Uncommon", "Common"];

  useEffect(() => {
    const fetchData = async (offset = 0) => {
      try {
        let filters = {};

        const filtersToString = (filters) => {
          return "{" + Object.entries(filters)
            .map(([key, value]) => `${key}: "${value}"`)
            .join(", ") + "}";
        };

        if (rarity) filters.rarity = rarity;
        if (parallel) filters.parallel = parallel;

        const query = `
            {
              filterNftParallelAssets(${Object.keys(filters).length > 0 ? "match: " + filtersToString(filters) : ""}, limit: 500, offset: ${offset}) {
                results {
                  id
                  address
                  tokenId
                  networkId
                  name
                  description
                  originalImage
                  uri
                  lastPriceUsd
                  lastPriceNetworkBaseToken
                  timestamp
                  media {
                    image
                    thumbSm
                    thumbLg
                  }
                  gameData {
                    rarity
                    parallel
                    cost
                    attack
                    health
                    cardType
                    subtype
                    functionText
                    passiveAbility
                  }
                  metadata {
                    class
                    supply
                    flavourText
                    expansion
                    paraset
                    artist
                  }
                }
              }
            }
          `;

        const response = await axios.post(
          '/',
          { query },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.REACT_APP_DEFINED_API_KEY,
            },
          },
        );
        console.log(response)
        //console.log(response.data.data.filterNftParallelAssets.results[0])
        //setNfts(response.data.data.filterNftParallelAssets.results);

        if (response.data.data && response.data.data.filterNftParallelAssets) {
          const newNfts = response.data.data.filterNftParallelAssets.results;
          if (newNfts.length > 0) {
            setNfts((prevNfts) => [...prevNfts, ...newNfts]);
            fetchData(offset + 500);
          }
        } else {
          console.error('No data returned from API');
        }

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [rarity, parallel]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: theme.palette.background.default, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        <FormControl>
          <InputLabel id="rarity-select-label">Rarity</InputLabel>
            <Select
              labelId="rarity-select-label"
              id="rarity-select"
              value={rarity}
              label="Rarity"
              onChange={(event) => setRarity(event.target.value)}
            >
              {rarities.map((rarityOption) => (
                <MenuItem value={rarityOption} key={rarityOption}>
                  {rarityOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
          <InputLabel id="parallel-select-label">Parallel</InputLabel>
            <Select
              labelId="parallel-select-label"
              id="parallel-select"
              value={parallel}
              label="Parallel"
              onChange={(event) => setParallel(event.target.value)}
            >
              {parallels.map((parallelOption) => (
                <MenuItem value={parallelOption} key={parallelOption}>
                  {parallelOption}
                </MenuItem>
              ))}
            </Select>
        </FormControl>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {nfts.map((nft, index) => (
          <Box key={`${nft.address}:${nft.tokenId}:${index}`} sx={{ margin: 2 }}>
            <NFTCard nft={nft} />
          </Box>
        ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;