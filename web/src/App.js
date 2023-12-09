import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import "./App.css";
import chatAndTradeABI from "./chatAndTradeABI.json";
import WethABI from "./WethABI.json";
import UsdcABI from "./UsdcABI.json";

function App() {
  let chantAndTradeContract = "0xeEcE071C18158561df902C0B0D9aa2Aac03D4Ab6"; //zkEVM
  let WETHContract = "0x34249400e31CF6C7EDE5149D5EF7be3dED2b1C4d";
  let USDCContract = "0x42241BB17d1bf31daD36B2cA376052c6368e72f5";

  let [blockchainProvider, setBlockchainProvider] = useState(undefined);
  let [metamask, setMetamask] = useState(undefined);
  let [metamaskNetwork, setMetamaskNetwork] = useState(undefined);
  let [metamaskSigner, setMetamaskSigner] = useState(undefined);
  const [networkId, setNetworkId] = useState(undefined);
  const [loggedInAccount, setAccounts] = useState(undefined);
  const [etherBalance, setEtherBalance] = useState(undefined);
  const [isError, setError] = useState(false);

  const [contract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);
  const [USDCread, setUSDCRead] = useState(null);
  const [USDCWrite, setUSDCWrite] = useState(null);
  const [WETHread, setWETHRead] = useState(null);
  const [WETHWrite, setwethWrite] = useState(null);

  const [inrBal, setInrBal] = useState(null);
  const [USDCBal, setUSDCBal] = useState(null);
  const [tokenInput, setTokenInput] = useState(null);
  const [tokenInput3, setTokenInput3] = useState(null);

  const [sellerAMount, setSellerAMount] = useState();
  const [sellerSP, setSellerSP] = useState();
  const [sellerCrypto, setSellerCrypto] = useState("");

  const [sellersList, setSellersList] = useState([]);

  const [address, setAddress] = useState(null);
  const [address2, setAddress2] = useState(null);
  const [displayFees, setDisplayFees] = useState(null);

  let alertMessage;

  const connect = async () => {
    //############################################################################################//
    //############################### Metamask Integration ###################################//
    //############################################################################################//

    try {
      let provider, network, metamaskProvider, signer, accounts;

      if (typeof window.ethereum !== "undefined") {
        // Connect to RPC
        console.log("loadNetwork");
        try {
          //console.log("acc", acc);
          //window.ethereum.enable();
          //await handleAccountsChanged();
          accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          await handleAccountsChanged(accounts);
        } catch (err) {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        }
        provider = new ethers.providers.JsonRpcProvider(
          // `https://sepolia.infura.io/v3/c811f30d8ce746e5a9f6eb173940e98a`
          `https://rpc.public.zkevm-test.net`
        );
        //const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
        setBlockchainProvider(provider);
        network = await provider.getNetwork();
        console.log(network.chainId);
        setNetworkId(network.chainId);

        // Connect to Metamask
        metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
        setMetamask(metamaskProvider);

        signer = await metamaskProvider.getSigner(accounts[0]);
        setMetamaskSigner(signer);

        metamaskNetwork = await metamaskProvider.getNetwork();
        setMetamaskNetwork(metamaskNetwork.chainId);

        console.log(network);

        if (network.chainId !== metamaskNetwork.chainId) {
          alert("Your Metamask wallet is not connected to " + network.name);

          setError("Metamask not connected to RPC network");
        }

        let tempContract = new ethers.Contract(
          chantAndTradeContract,
          chatAndTradeABI,
          provider
        );
        setReadContract(tempContract); //contract
        let tempContract2 = new ethers.Contract(
          chantAndTradeContract,
          chatAndTradeABI,
          signer
        );
        setWriteContract(tempContract2); //writeContract

        let USDCRead = new ethers.Contract(WETHContract, WethABI, provider);
        setWETHRead(USDCRead); //WETHread
        let USDCWrite = new ethers.Contract(WETHContract, WethABI, signer);
        setwethWrite(USDCWrite); //WETHwrite

        let INRCRead = new ethers.Contract(USDCContract, UsdcABI, provider);
        setUSDCRead(INRCRead); //USDCread
        let INRCWrite = new ethers.Contract(USDCContract, UsdcABI, signer);
        setUSDCWrite(INRCWrite); //USDCwrite
      } else setError("Could not connect to any blockchain!!");

      return {
        provider,
        metamaskProvider,
        signer,
        network: network.chainId,
      };
    } catch (e) {
      console.error(e);
      setError(e);
    }
  };
  const handleAccountsChanged = async (accounts) => {
    if (typeof accounts !== "string" || accounts.length < 1) {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    }
    console.log("t1", accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      alert("Please connect to MetaMask.");
    } else if (accounts[0] !== loggedInAccount) {
      setAccounts(accounts[0]);
    }
  };
  const init = async () => {
    const { provider, metamaskProvider, signer, network } = await connect();

    const accounts = await metamaskProvider.listAccounts();
    console.log(accounts[0]);
    setAccounts(accounts[0]);

    if (typeof accounts[0] == "string") {
      setEtherBalance(
        ethers.utils.formatEther(
          Number(await metamaskProvider.getBalance(accounts[0])).toString()
        )
      );
    }
  };
  useEffect(() => {
    init();

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    window.ethereum.on("chainChanged", function (networkId) {
      // Time to reload your interface with the new networkId
      //window.location.reload();
      unsetStates();
    });
  }, []);

  useEffect(() => {
    (async () => {
      init();
      // if (typeof metamask == 'object' && typeof metamask.getBalance == 'function'
      //     && typeof loggedInAccount == "string") {
      //     setEtherBalance(ethers.utils.formatEther(
      //         Number(await metamask.getBalance(loggedInAccount)).toString()
      //     ));

      // }
    })();
  }, [loggedInAccount]);

  const unsetStates = useCallback(() => {
    setBlockchainProvider(undefined);
    setMetamask(undefined);
    setMetamaskNetwork(undefined);
    setMetamaskSigner(undefined);
    setNetworkId(undefined);
    setAccounts(undefined);
    setEtherBalance(undefined);
  }, []);

  const isReady = useCallback(() => {
    return (
      typeof blockchainProvider !== "undefined" &&
      typeof metamask !== "undefined" &&
      typeof metamaskNetwork !== "undefined" &&
      typeof metamaskSigner !== "undefined" &&
      typeof networkId !== "undefined" &&
      typeof loggedInAccount !== "undefined"
    );
  }, [
    blockchainProvider,
    metamask,
    metamaskNetwork,
    metamaskSigner,
    networkId,
    loggedInAccount,
  ]);

  //############################################################################################//
  //############################### Smart Contract Integration ###################################//
  //############################################################################################//

  const checkApproval = async () => {
    const signerAddress = await metamaskSigner.getAddress();
    const maxUint = String(
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    );
    const minimumAmount = String(ethers.utils.parseEther("1000"));
    let approvedBalUSDC = await USDCread.allowance(
      signerAddress,
      chantAndTradeContract
    );
    if (approvedBalUSDC <= minimumAmount) {
      await USDCWrite.approve(chantAndTradeContract, maxUint);
    }

    let approvedBalWETH = await USDCread.allowance(
      signerAddress,
      chantAndTradeContract
    );
    if (approvedBalWETH <= minimumAmount) {
      await WETHWrite.approve(chantAndTradeContract, maxUint);
    }
  };

  const mintWETH = async (amountIn) => {
    amountIn = String(ethers.utils.parseEther(amountIn));
    const signerAddress = await metamaskSigner.getAddress();
    await WETHWrite.mint(signerAddress, amountIn);
  };

  const mintUSDC = async (amountIn) => {
    amountIn = String(ethers.utils.parseEther(amountIn));
    const signerAddress = await metamaskSigner.getAddress();
    await USDCWrite.mint(signerAddress, amountIn);
  };

  const listAsSeller = async (crypto, amount, sp) => {
    const signerAddress = await metamaskSigner.getAddress();

    amount = String(ethers.utils.parseEther(amount));
    console.log("Amountt =>", amount);
    sp = String(ethers.utils.parseEther(sp));
    console.log("SPppp=>", sp);
    await writeContract.listAsSeller(crypto, amount, sp);
  };

  const getSellersList = async () => {
    const sellersArray = await contract.getAllSellers();
    console.log("Sellers Array =>", sellersArray);

    let a = sellersArray.map(async (seller) => {
      let cryptoList = await contract.sellersListMap[seller];
      return {
        Seller: seller,
        Crypto: cryptoList,
      };
    });
    console.log("Sellers Array =>", sellersArray);
    setSellersList(sellersArray);
    return a;
  };

  const INR_Balance = async (addr) => {
    // const signerAddress = await metamaskSigner.getAddress();
    let val = await contract.INR_BalanceOf(addr);

    val = String(ethers.utils.formatEther(val));
    console.log(String(val));
    setInrBal(val);
  };

  const USDC_Balance = async (addr) => {
    console.log("addr", addr);
    const signerAddress = await metamaskSigner.getAddress();
    let val = await contract.USDC_BalanceOf(addr);

    val = String(ethers.utils.formatEther(val));
    console.log(String(val));
    setUSDCBal(val);
  };

  const transferUSDCToOwner = async () => {
    await writeContract.transferFeesToOwner({ gasLimit: 500000 });
  };

  const getFees = async () => {
    let val = await contract.getFees();
    val = ethers.utils.formatEther(val);
    setDisplayFees(String(val));
  };

  if (isError) {
    return (
      <>
        <div className="alert alert-danger" role="alert">
          Error
        </div>
        ;
      </>
    );
  } else if (!isReady()) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="container">
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
        </nav>
        <div class="row">
          <div class="col-sm">
            <div class="card" style={{ width: "18rem;" }}>
              <div class="card-body">
                <h5 class="card-title">WETH Faucet</h5>

                <form className="input" onSubmit={mintWETH}>
                  <input
                    id="tokenIn"
                    value={tokenInput}
                    onChange={(event) => setTokenInput(event.target.value)}
                    type="text"
                    placeholder="Token amount "
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => mintWETH(tokenInput)}
                  >
                    {" "}
                    Mint{" "}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-sm">
            <div class="card" style={{ width: "18rem;" }}>
              <div class="card-body">
                <h5 class="card-title">Mint USDC</h5>
                <form className="input" onSubmit={mintUSDC}>
                  <input
                    id="tokenIn"
                    value={tokenInput3}
                    onChange={(event) => setTokenInput3(event.target.value)}
                    type="text"
                    placeholder="Token amount "
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => mintUSDC(tokenInput3)}
                  >
                    {" "}
                    Mint{" "}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-sm">
            <div class="card" style={{ width: "18rem;" }}>
              <div class="card-body">
                <h5 class="card-title">List as Seller</h5>

                <form className="input" onSubmit={listAsSeller}>
                  <input
                    id="tokenIn"
                    value={sellerCrypto}
                    onChange={(event) => setSellerCrypto(event.target.value)}
                    type="text"
                    placeholder="Token Address"
                  />
                  <input
                    id="tokenIn"
                    value={sellerAMount}
                    onChange={(event) => setSellerAMount(event.target.value)}
                    type="number"
                    placeholder="Amount of Token"
                  />
                  <input
                    id="tokenIn"
                    value={sellerSP}
                    onChange={(event) => setSellerSP(event.target.value)}
                    type="number"
                    placeholder="Selling Price(ETH)"
                  />

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      listAsSeller(sellerCrypto, sellerAMount, sellerSP)
                    }
                  >
                    {" "}
                    List{" "}
                  </button>
                </form>
                <br />

                {/* <div class="col-sm">
                  <div class="card" style={{ width: "18rem;" }}>
                    <div class="card-body">
                      <h5 class="card-title">Seller List</h5>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => getSellersList()}
                      >
                        {" "}
                        Get{" "}
                      </button>
                      {sellersList}
                    </div>
                  </div>
                </div> */}

                <table>
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Seller's Address</th>
                      <th>Token Address</th>
                      <th>Amount</th>
                      <th>Selling Price</th>
                    </tr>
                  </thead>
                </table>

                <form className="input" onSubmit={transferUSDCToOwner}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => transferUSDCToOwner()}
                  >
                    {" "}
                    Transfer Fees to Owner{" "}
                  </button>
                </form>
                <div className="font-weight-normal"></div>
              </div>
            </div>
          </div>

          <div class="col-sm">
            <div class="card" style={{ width: "18rem;" }}>
              <div class="card-body">
                <input
                  id="tokenIn"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  type="text"
                  placeholder="Address"
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => INR_Balance(address)}
                >
                  {" "}
                  INR Bal{" "}
                </button>
                {inrBal}
                <br /> <br />
                <input
                  id="tokenIn"
                  value={address2}
                  onChange={(event) => setAddress2(event.target.value)}
                  type="text"
                  placeholder="Address"
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => USDC_Balance(address2)}
                >
                  {" "}
                  USDC Bal{" "}
                </button>
                {USDCBal}
                <br /> <br />
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => getFees()}
                >
                  {" "}
                  Fees{" "}
                </button>
                <p>{displayFees}</p>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
