import logo from './theSphereLogo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import 'sf-font';
import axios from 'axios';
import ABI from './ABI.json';
import VAULTABI from './VAULTABI.json';
import TOKENABI from './TOKENABI.json';
import { NFTCONTRACT, STAKINGCONTRACT, nftpng, polygonscanapi, moralisapi } from './config';

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink"
import Web3 from "web3";

var account = null;
var contract = null;
var vaultcontract = null;
var web3 = null;

const polygonscanapikey = "DBQX5JUSAVUZRK8CC4IN2UZF9N2HA63P4U";
const moralisapikey = "2VBV4vaCLiuGu6Vu7epXKlFItGe3jSPON8WV4CrXKYaNBEazEUrf1xwHxbrIo1oM";

const providerOptions = {
	binancechainwallet: {
		package: true
	  },
	  walletconnect: {
		package: WalletConnectProvider,
		options: {
		  infuraId: "3cf2d8833a2143b795b7796087fff369"
		}
	},
	walletlink: {
		package: WalletLink,
		options: {
		  appName: "Net2Dev NFT Minter",
		  infuraId: "3cf2d8833a2143b795b7796087fff369",
		  rpc: "",
		  chainId: 4,
		  appLogoUrl: null,
		  darkMode: true
		}
	  },
};

const web3Modal = new Web3Modal({
	network: "rinkeby",
	theme: "dark",
	cacheProvider: true,
	providerOptions
});

class App extends Component {
  constructor() {
		super();
		this.state = {
			balance: [],
			nftdata: [],
			rawearn: [],
		};
	}

  handleModal(){
		this.setState({show:!this.state.show})
	}

	handleNFT(nftamount) {
		this.setState({outvalue:nftamount.target.value});
  	}

	async componentDidMount() {

		await axios.get((polygonscanapi + `?module=stats&action=tokensupply&contractaddress=${NFTCONTRACT}&apikey=${polygonscanapikey}`))
		.then(outputa => {
            this.setState({
                balance:outputa.data
            })
            console.log(outputa.data)
        })
		let config = {'X-API-Key': moralisapikey, 'accept': 'application/json'};
		await axios.get((moralisapi + `/nft/${NFTCONTRACT}/owners?chain=mumbai&format=decimal`), {headers: config})
		.then(outputb => {
			const { result } = outputb.data
            this.setState({
                nftdata:result
            })
            console.log(outputb.data)
        })
	}

render() {
	const {balance} = this.state;
	const {nftdata} = this.state;
	const {outvalue} = this.state;

  async function connectwallet() {
    var provider = await web3Modal.connect();
    web3 = new Web3(provider);
    await provider.send('eth_requestAccounts');
    var accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById('wallet-address').textContent = account;
    contract = new web3.eth.Contract(ABI, NFTCONTRACT);
    vaultcontract = new web3.eth.Contract(VAULTABI, STAKINGCONTRACT);
    var getstakednfts = await vaultcontract.methods.tokensOfOwner(account).call();
    document.getElementById('yournfts').textContent = getstakednfts;
    var getbalance = Number(await vaultcontract.methods.balanceOf(account).call());
    document.getElementById('stakedbalance').textContent = getbalance;
    const arraynft = Array.from(getstakednfts.map(Number));
    console.log(arraynft);
    const tokenid = arraynft.filter(Number);
    var rwdArray = [];
  }
  return (
    <div className="App">
      <body>
        <header class="p-1 text-bg-light">
          <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start" style={{ fontFamily: "SF Pro Display" }}>
              <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none" style={{ fontWeight: "600", fontSize: '25px' }}>
              <svg height="60" width="60">
                <circle cx="30" cy="30" r="20" fill="#ffa700" />
              </svg>
              </a>

              <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0" style={{ fontWeight: "400" }}>
                <li><a href="#" class="nav-link px-2 text-secondary">Dashboard</a></li>
                <li><a href="#" class="nav-link px-2 text-black">List NFTs</a></li>
                <li><a href="#" class="nav-link px-2 text-black">Bridge NFTs</a></li>
              </ul>

              <div class="text-end">
                <button id="connectbtn" onClick={connectwallet} type="button" class="connectbutton">Connect Wallet</button>
              </div>
            </div>
          </div>
        </header>


        <div class="wrapper container">
        <div className="mt-4 container container-style">
          <div className='col'>
            <body className="nftminter">
              <form>
              <div className="row pt-3 px-4">
                <div>
                  <h2 className="pt-2" style={{ fontWeight: "300" }}>Sphere NFT Minter</h2>
                </div>
                <h4 style={{fontFamily: "SF Pro Display", fontWeight: "400"}}>/1000</h4>
                <h6 style={{fontFamily: "SF Pro Display", fontWeight: "300"}}>Your Wallet Address</h6>
                <div className="pb-3" id='wallet-address' style={{
                  color: "#ffa700",
                  fontFamily: "SF Pro Display",
                  fontWeight: "400"
                }}>
                  <label style={{fontFamily: "SF Pro Display"}}for="floatingInput">Please Connect Wallet</label>
                </div>
              </div>
              <div className="pt-4 row">
                <label style={{ fontWeight: "300", fontSize: "18px" }}>Select NFT Quantity</label>
              </div>
              <ButtonGroup size="lg"
                aria-label="First group"
                name="amount"
                style={{ backgroundColor: "#ffa700" }}
              >
                <Button value="1">1</Button>
                <Button value="2">2</Button>
                <Button value="3">3</Button>
                <Button value="4">4</Button>
                <Button value="5">5</Button>
              </ButtonGroup>
              <h6 className="pt-5" style={{ fontFamily: "SF Pro Display", fontWeight: "300", fontSize: "18px" }}>Buy with your preferred crypto!</h6>
              <div className="row px-2 pb-2 row-style">
                <div className="col ">
                  <Button className="button-style" style={{ fontFamily: "SF Pro Display", fontWeight: "400", width: "100px", color: 'black', border: "0.2px", borderRadius: "14px" }}>
                    <img src={logo} width="100%" />SPHC
                  </Button>
                </div>
                <div className="col">
                  <Button className="button-style" style={{ fontFamily: "SF Pro Display", fontWeight: "400", width: "100px", color: 'black', border: "0.2px", borderRadius: "14px"}}>
                    <img src="usdt.png" width="100%" />USD-T
                  </Button>
                </div>
                <div className="col">
                  <Button className="button-style" style={{ fontFamily: "SF Pro Display", fontWeight: "400", width: "100px", color: 'black', border: "0.2px", borderRadius: "14px"}}>
                    <img src="matic.png" width="100%" />MATIC
                  </Button>
                </div>
                <div>
                  <div id='txout' style={{ color: "#ffa700", marginTop: "30px", fontSize: '20px', fontWeight: '500' }}>
                    <p style={{ fontSize: "20px" }}>Transfer Status</p>
                  </div>
                </div>
              </div>
            </form>
          </body>
        </div>
      </div>

      <div className="mt-4 container container-style">
        <div className='col'>
          <body className='nftstaker'>
            <form className="pt-4" style={{ fontFamily: "SF Pro Display" }} >
              <h2 style={{ borderRadius: '14px', fontWeight: "300" }}>Sphere NFT Staking Vault </h2>
              <h6 style={{ fontWeight: "300" }}>First time staking?</h6>
              <Button className="btn" style={{  }} >Authorize Your Wallet</Button>
              <div className="row px-3 py-4">
                <div className="col">
                  <form class="stakingrewards" style={{ borderRadius: "25px" }}>
                    <h5 style={{ color: "#000", fontWeight: '300' }}>Your Vault Activity</h5>
                    <h6 style={{ color: "#000" }}>Verify Staked Amount</h6>
                    <Button style={{ backgroundColor: "#ffffff10" }} >Verify</Button>
                    <table className='table mt-3 mb-5 px-3 table-dark'>
                      <tr>
                        <td style={{ fontSize: "19px", color: "#000" }}>Your Staked NFTs:
                          <span style={{ backgroundColor: "#ffffff00", fontSize: "21px", color: "#000", fontWeight: "500" }} id='yournfts'></span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: "19px", color: "#000" }}>Total Staked NFTs:
                          <span style={{ backgroundColor: "#ffffff00", fontSize: "21px", color: "#000", fontWeight: "500" }} id='stakedbalance'></span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: "19px", color: "#000" }}><p style={{ backgroundColor: "white", paddingBottom: "0px", marginBottom: "0px" }}>Unstake All Staked NFTs</p>
                          <Button className='mb-3' style={{ backgroundColor: "#ffffff10" }}>Unstake All</Button>
                        </td>
                      </tr>
                    </table>
                  </form>
                  </div>
                  <img style={{ width: "40%" }} className="col-lg-4" src="art.png"/>
                  <div className="col">
                    <form className='stakingrewards' style={{ borderRadius: "25px", fontFamily: "SF Pro Display" }}>
                      <h5 style={{ color: "#000", fontWeight: '300' }}> Staking Rewards</h5>
                      <Button style={{ backgroundColor: "#ffffff10" }} >Earned N2D Rewards</Button>
                      <div id='earned' style={{ color: "#ffa700", marginTop: "5px", fontSize: '25px', fontWeight: '500' }}><p style={{ fontSize: "20px" }}>Earned Tokens</p></div>
                      <div className='col-12 mt-2'>
                        <div style={{ color: 'black' }}>Claim Rewards</div>
                        <Button style={{ backgroundColor: "#ffffff10" }} className="mb-2">Claim</Button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row px-4 pt-2">
                  <div class="header">
                    <div style={{ fontSize: '25px', borderRadius: '14px', color: "#000", fontWeight: "300" }}>Sphere NFT Staking Pool Active Rewards</div>
                    <table className='table px-3 table-bordered table-dark'>
                      <thead className='thead-light'>
                        <tr>
                          <th scope="col">Collection</th>
                          <th scope="col">Rewards Per Day</th>
                          <th scope="col">Exchangeable Items</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Sphere Bronze Collection</td>
                          <td class="amount" data-test-id="rewards-summary-ads">
                            <span class="amount">0.50</span>&nbsp;<span class="currency">SPHC</span>
                          </td>
                          <td class="exchange">
                            <span class="amount">2</span>&nbsp;<span class="currency">NFTs/M</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Sphere Silver Collection</td>
                          <td class="amount" data-test-id="rewards-summary-ac">
                            <span class="amount">2.50</span>&nbsp;<span class="currency">SPHC</span>
                          </td>
                          <td class="exchange"><span class="amount">10</span>&nbsp;<span class="currency">NFTs/M</span>
                          </td>
                        </tr>
                        <tr className='stakegoldeffect'>
                          <td>Sphere Gold Collection</td>
                          <td class="amount" data-test-id="rewards-summary-one-time"><span class="amount">1</span>&nbsp;<span class="currency">SPHC+</span>
                          </td>
                          <td class="exchange">
                            <span class="amount">25 NFTs/M or </span>
                            <span class="currency">100 SPHC/M</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="header">
                      <div style={{ fontSize: '25px', borderRadius: '14px', fontWeight: '300' }}>SPHC Token Stake Farms</div>
                      <table className='table table-bordered table-dark' style={{ borderRadius: '14px' }} >
                        <thead className='thead-light'>
                          <tr>
                            <th scope="col">Farm Pools</th>
                            <th scope="col">Harvest Daily Earnings</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Stake SPHC to Earn SPHC</td>
                            <td class="amount" data-test-id="rewards-summary-ads">
                              <span class="amount">0.01</span>&nbsp;<span class="currency">Per SPHC</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Stake SPHC to Earn SPHC+</td>
                            <td class="amount" data-test-id="rewards-summary-ac">
                              <span class="amount">0.005</span>&nbsp;<span class="currency">Per SPHC</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </form>
            </body>
          </div>
        </div>
        <div className="container container-style">
          <div className="row items px-3 pt-3">
            <div className="ml-3 mr-3" style={{ display: "inline-grid", gridTemplateColumns: "repeat(4, 5fr)", columnGap: "20px" }}>
              {nftdata.map((result, i) => {
                async function stakeit() {
                  vaultcontract.methods.stake([result.token_id]).send({ from: account });
                }
                async function unstakeit() {
                  vaultcontract.methods.unstake([result.token_id]).send({ from: account });
                }
                return (
                  <div className="card nft-card mt-3" key={i} >
                    <div className="image-over">
                      <img className="card-img-top" src={nftpng + result.token_id + '.png'} alt="" />
                    </div>
                    <div className="card-caption col-12 p-0">
                      <div className="card-body">
                        <h5 className="mb-0">Sphere Collection NFT #{result.token_id}</h5>
                        <h6 className="mb-0 mt-2">Location Status<p style={{ color: "#ffa700", fontWeight: "bold" }}>{result.owner_of}</p></h6>
                        <div className="card-bottom d-flex justify-content-between">
                          <input key={i} type="hidden" id='stakeid' value={result.token_id} />
                          <Button style={{ marginLeft: '2px', backgroundColor: "#ffffff10" }} onClick={stakeit}>Stake it</Button>
                          <Button style={{ marginLeft: '2px', backgroundColor: "#ffffff10" }} onClick={unstakeit}>Unstake it</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
        <div class="container">
          <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div style={{ fontFamily: "SF Pro Display" }} class="col-md-4 d-flex align-items-center">
              <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                <svg height="60" width="60">
                  <circle cx="30" cy="30" r="20" fill="#ffa700" />
                </svg>
              </a>
              <span class="mb-3 mb-md-0 text-muted">© 2022 The Sphere</span>
            </div>

            <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
              <li class="ms-3"><a class="text-muted " href="https://github.com/TeamSphere/thespheremarket">
                <i class="bi bi-github"></i> Made with 🧡</a>
              </li>
            </ul>
          </footer>
        </div>
      </body>
    </div>
  );
};
}

export default App;
