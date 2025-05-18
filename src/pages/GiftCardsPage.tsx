import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material';
import { 
  Search, 
  CloudUpload, 
  CheckCircle, 
  ArrowBack, 
  ArrowForward,
  Menu as MenuIcon,
  ShoppingCart,
  Sell,
  CreditCard
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navigation from '../components/Navigation';
import {getGiftCards, createGiftCardTransaction} from '../api'

interface GiftCardCategory {
  name: string;
  sellRate: number;
  buyRate: number;
}

interface GiftCardType {
  name: string;
  codePrefixes?: string[];
}

interface GiftCard {
  id: string;
  name: string;
  icon: string;
  color: string;
  countries: string[];
  categories?: GiftCardCategory[];
  types?: GiftCardType[];
  requiresFrontBack?: boolean;
  isInformationCard?: boolean;
  receiptTypes?: string[];
}

interface TransactionDetails {
  cardType: string;
  country: string;
  category?: string;
  cardTypeOption?: string;
  receiptType?: string;
  amount: number;
  totalNaira: number;
  cardNumber?: string;
  cardPin?: string;
  email?: string;
  receipt?: File;
}

const giftCards: GiftCard[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '🛒',
    color: '#FF9900',
    countries: ['US', 'UK', 'Canada', 'Australia', 'Germany'],
    categories: [
      { name: 'Cash receipt', sellRate: 500, buyRate: 550 },
      { name: 'No receipt', sellRate: 480, buyRate: 530 },
      { name: 'Debit receipt', sellRate: 490, buyRate: 540 },
      { name: 'Credit receipt', sellRate: 495, buyRate: 545 },
      { name: 'Ecode', sellRate: 510, buyRate: 560 }
    ],
    receiptTypes: ['Cash receipt', 'No receipt', 'Debit receipt', 'Credit receipt', 'Ecode']
  },
  {
    id: 'steam',
    name: 'Steam',
    icon: '🎮',
    color: '#00ADE1',
    countries: ['Australia', 'US', 'Switzerland', 'UK', 'Belgium', 'Spain', 'Canada', 'New Zealand', 'Italy', 'Germany'],
    types: [
      { name: 'Physical' },
      { name: 'Ecode' }
    ],
    categories: [
      { name: 'Standard', sellRate: 450, buyRate: 500 }
    ]
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: '🍎',
    color: '#FF3B30',
    countries: ['France', 'Netherlands', 'Australia', 'Finland', 'Switzerland', 'UK', 'Belgium', 'Germany', 'Spain', 'Canada', 'Austria', 'Singapore', 'US'],
    types: [
      { name: 'Horizontal version' },
      { name: 'Vertical version' },
      { name: 'Slow-load' },
      { name: 'Fast-load' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 520, buyRate: 570 }
    ]
  },
  {
    id: 'google-play',
    name: 'Google Play',
    icon: '▶️',
    color: '#0F9D58',
    countries: ['Australia', 'Switzerland', 'UK', 'Belgium', 'Germany', 'Canada', 'Brazil', 'US', 'New Zealand'],
    types: [
      { name: 'Physical' },
      { name: 'Ecode' }
    ],
    categories: [
      { name: 'Standard', sellRate: 470, buyRate: 520 }
    ],
    isInformationCard: true
  },
  {
    id: 'razor-gold',
    name: 'Razor Gold',
    icon: '💰',
    color: '#F7931A',
    countries: ['Australia', 'Malaysia', 'Canada', 'Singapore', 'US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 460, buyRate: 510 }
    ]
  },
  {
    id: 'foot-locker',
    name: 'Foot Locker',
    icon: '👟',
    color: '#E31937',
    countries: ['US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 440, buyRate: 490 }
    ]
  },
  {
    id: 'ebay',
    name: 'eBay',
    icon: '📦',
    color: '#E53238',
    countries: ['US', 'Canada'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 430, buyRate: 480 }
    ]
  },
  {
    id: 'sephora',
    name: 'Sephora',
    icon: '💄',
    color: '#E4008C',
    countries: ['Canada', 'US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 420, buyRate: 470 }
    ]
  },
  {
    id: 'xbox',
    name: 'Xbox',
    icon: '🎮',
    color: '#107C10',
    countries: ['Canada', 'US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 450, buyRate: 500 }
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    icon: '👾',
    color: '#EC3D3D',
    countries: ['US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 440, buyRate: 490 }
    ]
  },
  {
    id: 'visa',
    name: 'Visa Gift Card',
    icon: '💳',
    color: '#1A1F71',
    countries: ['US', 'Canada'],
    types: [
      { name: '4852' },
      { name: '4034' },
      { name: '4746' },
      { name: '4358' },
      { name: '4912' }
    ],
    categories: [
      { name: 'Standard', sellRate: 400, buyRate: 450 }
    ],
    requiresFrontBack: true
  },
  {
    id: 'walmart-visa',
    name: 'Walmart Visa Card',
    icon: '🏪',
    color: '#007DC6',
    countries: ['US'],
    types: [
      { name: 'Physical' }
    ],
    categories: [
      { name: 'Standard', sellRate: 410, buyRate: 460 }
    ]
  },
  {
    id: 'walmart',
    name: 'Walmart Card',
    icon: '🏪',
    color: '#007DC6',
    countries: ['US'],
    types: [
      { name: 'Physical' }
    ],
    categories: [
      { name: 'Standard', sellRate: 420, buyRate: 470 }
    ]
  },
  {
    id: 'nordstrom',
    name: 'Nordstrom',
    icon: '👔',
    color: '#000000',
    countries: ['US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 430, buyRate: 480 }
    ]
  },
  {
    id: 'macys',
    name: 'Macy\'s',
    icon: '🛍️',
    color: '#E21836',
    countries: ['US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 420, buyRate: 470 }
    ]
  },
  {
    id: 'nike',
    name: 'Nike',
    icon: '👟',
    color: '#000000',
    countries: ['US'],
    types: [
      { name: 'Physical' },
      { name: 'E-code' }
    ],
    categories: [
      { name: 'Standard', sellRate: 440, buyRate: 490 }
    ]
  },
  {
    id: 'gamestop',
    name: 'GameStop',
    icon: '🎮',
    color: '#0E7C0E',
    countries: ['US'],
    types: [
      { name: 'Physical' }
    ],
    categories: [
      { name: 'Standard', sellRate: 430, buyRate: 480 }
    ]
  },
  {
    id: 'finish-line',
    name: 'Finish Line',
    icon: '🏁',
    color: '#BD081C',
    countries: ['US'],
    types: [
      { name: 'Physical' }
    ],
    categories: [
      { name: 'Standard', sellRate: 420, buyRate: 470 }
    ]
  }
];

const sellSteps = ['Select Gift Card', 'Enter Details', 'Upload & Review'];
const buySteps = ['Select Gift Card', 'Enter Amount', 'Payment'];

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const GiftCardsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sellTransaction, setSellTransaction] = useState<TransactionDetails>({
    cardType: '',
    country: '',
    category: '',
    cardTypeOption: '',
    receiptType: '',
    amount: 0,
    totalNaira: 0,
    cardNumber: '',
    cardPin: '',
  });
  const [buyTransaction, setBuyTransaction] = useState<TransactionDetails>({
    cardType: '',
    country: '',
    category: '',
    cardTypeOption: '',
    amount: 0,
    totalNaira: 0,
    email: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setActiveStep(0);
    setCompleted(false);
  };

  const filteredCards = giftCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleCardSelect = (cardId: string) => {
    const selectedCard = giftCards.find(card => card.id === cardId);
    if (activeTab === 0) {
      setSellTransaction({ 
        ...sellTransaction, 
        cardType: cardId,
        country: selectedCard?.countries[0] || '',
        category: selectedCard?.categories?.[0]?.name || ''
      });
    } else {
      setBuyTransaction({ 
        ...buyTransaction, 
        cardType: cardId,
        country: selectedCard?.countries[0] || '',
        category: selectedCard?.categories?.[0]?.name || '',
        cardTypeOption: selectedCard?.types?.[0]?.name || ''
      });
    }
    handleNext();
  };

  const calculateTotal = (amount: number, cardId: string, category?: string, isBuy = false) => {
    const selectedCard = giftCards.find(card => card.id === cardId);
    const selectedCategory = selectedCard?.categories?.find(cat => cat.name === category);
    const rate = isBuy ? selectedCategory?.buyRate : selectedCategory?.sellRate;
    return rate ? amount * rate : 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const completeTransaction = () => {
    setTimeout(() => setCompleted(true), 2000);
  };

  const resetTransaction = () => {
    setActiveStep(0);
    if (activeTab === 0) {
      setSellTransaction({
        cardType: '',
        country: '',
        category: '',
        cardTypeOption: '',
        receiptType: '',
        amount: 0,
        totalNaira: 0,
        cardNumber: '',
        cardPin: '',
      });
    } else {
      setBuyTransaction({
        cardType: '',
        country: '',
        category: '',
        cardTypeOption: '',
        amount: 0,
        totalNaira: 0,
        email: ''
      });
    }
    setPreviewImage(null);
    setCompleted(false);
  };

  const selectedCard = giftCards.find(card => 
    card.id === (activeTab === 0 ? sellTransaction.cardType : buyTransaction.cardType)
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 240px)` }, ml: { md: '240px' } }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
        )}

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Gift Cards
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Sell Gift Cards" icon={<Sell />} iconPosition="start" />
            <Tab label="Buy Gift Cards" icon={<ShoppingCart />} iconPosition="start" />
          </Tabs>

          {/* Sell Flow */}
          {activeTab === 0 ? (
            <>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {sellSteps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search gift cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    '& > *': {
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: '300px'
                    }
                  }}>
                    {filteredCards.map(card => (
                      <Box key={card.id}>
                        <StyledCard onClick={() => handleCardSelect(card.id)}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar sx={{ bgcolor: card.color, mr: 2 }}>{card.icon}</Avatar>
                            <Typography variant="h6">{card.name}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {card.categories?.map((cat) => (
                              <React.Fragment key={cat.name}>
                                <Chip label={`Sell: ₦${cat.sellRate}/$`} color="primary" size="small" />
                                <Chip label={`Buy: ₦${cat.buyRate}/$`} color="secondary" size="small" />
                              </React.Fragment>
                            ))}
                          </Box>
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Countries: {card.countries.join(', ')}
                          </Typography>
                        </StyledCard>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {activeStep === 1 && selectedCard && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedCard.name} Gift Card Details
                  </Typography>

                  <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                      <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={sellTransaction.country}
                          onChange={(e) => setSellTransaction({...sellTransaction, country: e.target.value as string})}
                          label="Country"
                        >
                          {selectedCard.countries.map(country => (
                            <MenuItem key={country} value={country}>{country}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    {selectedCard.categories && selectedCard.categories.length > 0 && (
                      <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={sellTransaction.category || ''}
                            onChange={(e) => {
                              const newCategory = e.target.value as string;
                              setSellTransaction({
                                ...sellTransaction,
                                category: newCategory,
                                totalNaira: calculateTotal(
                                  sellTransaction.amount,
                                  sellTransaction.cardType,
                                  newCategory
                                )
                              });
                            }}
                            label="Category"
                          >
                            {selectedCard.categories.map(cat => (
                              <MenuItem key={cat.name} value={cat.name}>{cat.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}

                    {selectedCard.types && selectedCard.types.length > 0 && (
                      <Box width="100%">
                        <FormControl component="fieldset" fullWidth>
                          <FormLabel component="legend">Card Type</FormLabel>
                          <RadioGroup
                            row
                            value={sellTransaction.cardTypeOption || ''}
                            onChange={(e) => setSellTransaction({...sellTransaction, cardTypeOption: e.target.value})}
                          >
                            {selectedCard.types.map(type => (
                              <FormControlLabel 
                                key={type.name} 
                                value={type.name} 
                                control={<Radio />} 
                                label={type.name} 
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    )}

                    {selectedCard.id === 'amazon' && (
                      <Box width="100%">
                        <FormControl component="fieldset" fullWidth>
                          <FormLabel component="legend">Receipt Type</FormLabel>
                          <RadioGroup
                            row
                            value={sellTransaction.receiptType || ''}
                            onChange={(e) => setSellTransaction({...sellTransaction, receiptType: e.target.value})}
                          >
                            {selectedCard.receiptTypes?.map(type => (
                              <FormControlLabel 
                                key={type} 
                                value={type} 
                                control={<Radio />} 
                                label={type} 
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    label="Card Amount ($)"
                    type="number"
                    value={sellTransaction.amount || ''}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value) || 0;
                      setSellTransaction({
                        ...sellTransaction,
                        amount,
                        totalNaira: calculateTotal(
                          amount,
                          sellTransaction.cardType,
                          sellTransaction.category
                        )
                      });
                    }}
                    sx={{ mb: 2 }}
                  />

                  {sellTransaction.amount > 0 && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      You will receive: ₦{sellTransaction.totalNaira.toLocaleString()}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Card Number"
                    value={sellTransaction.cardNumber}
                    onChange={(e) => setSellTransaction({...sellTransaction, cardNumber: e.target.value})}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Card PIN"
                    value={sellTransaction.cardPin}
                    onChange={(e) => setSellTransaction({...sellTransaction, cardPin: e.target.value})}
                  />

                  {selectedCard.requiresFrontBack && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Front and back images of the card are required for this transaction.
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button startIcon={<ArrowBack />} onClick={handleBack}>
                      Back
                    </Button>
                    <Button 
                      variant="contained" 
                      endIcon={<ArrowForward />}
                      onClick={handleNext}
                      disabled={
                        !sellTransaction.amount || 
                        !sellTransaction.cardNumber || 
                        !sellTransaction.cardPin ||
                        (selectedCard.types && !sellTransaction.cardTypeOption) ||
                        (selectedCard.id === 'amazon' && !sellTransaction.receiptType)
                      }
                    >
                      Continue
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Upload Receipt {selectedCard?.requiresFrontBack ? '(Front & Back Required)' : '(Optional)'}
                  </Typography>

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    sx={{ mb: 3 }}
                  >
                    Upload Receipt
                    <input 
                      type="file" 
                      hidden 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      multiple={selectedCard?.requiresFrontBack}
                    />
                  </Button>

                  {previewImage && (
                    <Box sx={{ mb: 3 }}>
                      <img 
                        src={previewImage} 
                        alt="Receipt preview" 
                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} 
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button startIcon={<ArrowBack />} onClick={handleBack}>
                      Back
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={completeTransaction}
                    >
                      Complete Transaction
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <>
              {/* Buy Flow */}
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {buySteps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Box>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search gift cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    '& > *': {
                      flex: '1 1 calc(50% - 12px)',
                      minWidth: '300px'
                    }
                  }}>
                    {filteredCards.map(card => (
                      <Box key={card.id}>
                        <StyledCard onClick={() => handleCardSelect(card.id)}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar sx={{ bgcolor: card.color, mr: 2 }}>{card.icon}</Avatar>
                            <Typography variant="h6">{card.name}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {card.categories?.map((cat) => (
                              <Chip 
                                key={cat.name}
                                label={`Buy: ₦${cat.buyRate}/$`} 
                                color="secondary" 
                                size="small" 
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Countries: {card.countries.join(', ')}
                          </Typography>
                        </StyledCard>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {activeStep === 1 && selectedCard && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Buy {selectedCard.name} Gift Card
                  </Typography>

                  <Box display="flex" flexWrap="wrap" gap={3} sx={{ mb: 3 }}>
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                      <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={buyTransaction.country}
                          onChange={(e) => setBuyTransaction({...buyTransaction, country: e.target.value as string})}
                          label="Country"
                        >
                          {selectedCard.countries.map(country => (
                            <MenuItem key={country} value={country}>{country}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    {selectedCard.categories && selectedCard.categories.length > 0 && (
                      <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                        <FormControl fullWidth>
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={buyTransaction.category || ''}
                            onChange={(e) => {
                              const newCategory = e.target.value as string;
                              setBuyTransaction({
                                ...buyTransaction,
                                category: newCategory,
                                totalNaira: calculateTotal(
                                  buyTransaction.amount,
                                  buyTransaction.cardType,
                                  newCategory,
                                  true
                                )
                              });
                            }}
                            label="Category"
                          >
                            {selectedCard.categories.map(cat => (
                              <MenuItem key={cat.name} value={cat.name}>{cat.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}

                    {selectedCard.types && selectedCard.types.length > 0 && (
                      <Box width="100%">
                        <FormControl component="fieldset" fullWidth>
                          <FormLabel component="legend">Card Type</FormLabel>
                          <RadioGroup
                            row
                            value={buyTransaction.cardTypeOption || ''}
                            onChange={(e) => setBuyTransaction({...buyTransaction, cardTypeOption: e.target.value})}
                          >
                            {selectedCard.types.map(type => (
                              <FormControlLabel 
                                key={type.name} 
                                value={type.name} 
                                control={<Radio />} 
                                label={type.name} 
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    label="Amount ($)"
                    type="number"
                    value={buyTransaction.amount || ''}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value) || 0;
                      setBuyTransaction({
                        ...buyTransaction,
                        amount,
                        totalNaira: calculateTotal(
                          amount,
                          buyTransaction.cardType,
                          buyTransaction.category,
                          true
                        )
                      });
                    }}
                    sx={{ mb: 2 }}
                  />

                  {buyTransaction.amount > 0 && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      You will pay: ₦{buyTransaction.totalNaira.toLocaleString()}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label="Email for Delivery"
                    type="email"
                    value={buyTransaction.email || ''}
                    onChange={(e) => setBuyTransaction({...buyTransaction, email: e.target.value})}
                    sx={{ mb: 2 }}
                  />

                  {selectedCard.isInformationCard && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                      Note: This is an information card and might not be successfully loaded in some cases.
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button startIcon={<ArrowBack />} onClick={handleBack}>
                      Back
                    </Button>
                    <Button 
                      variant="contained" 
                      endIcon={<ArrowForward />}
                      onClick={handleNext}
                      disabled={
                        !buyTransaction.amount || 
                        !buyTransaction.email ||
                        (selectedCard.types && !buyTransaction.cardTypeOption)
                      }
                    >
                      Continue
                    </Button>
                  </Box>
                </Box>
              )}

              {activeStep === 2 && selectedCard && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Review Your Order
                  </Typography>

                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {selectedCard.name} Gift Card
                      {buyTransaction.category && ` (${buyTransaction.category})`}
                      {buyTransaction.cardTypeOption && ` - ${buyTransaction.cardTypeOption}`}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Country: {buyTransaction.country}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Amount: ${buyTransaction.amount}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Total: ₦{buyTransaction.totalNaira.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Delivery Email: {buyTransaction.email}
                    </Typography>
                  </Paper>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button startIcon={<ArrowBack />} onClick={handleBack}>
                      Back
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success"
                      startIcon={<CreditCard />}
                      onClick={completeTransaction}
                    >
                      Proceed to Payment
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}

          <Dialog open={completed} onClose={resetTransaction}>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 1, fontSize: 40 }} />
                <Typography variant="h6">
                  {activeTab === 0 ? 'Transaction Submitted!' : 'Order Placed Successfully!'}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography>
                {activeTab === 0 ? (
                  `Your ${selectedCard?.name} gift card is being processed. You'll receive ₦${sellTransaction.totalNaira.toLocaleString()} 
                  once verified.`
                ) : (
                  `Your ${selectedCard?.name} gift card purchase is being processed. You'll receive your ${buyTransaction.amount}$ 
                  gift card at ${buyTransaction.email} within 24 hours.`
                )}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={resetTransaction}>Start New Transaction</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default GiftCardsPage;