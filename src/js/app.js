App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    console.log('init function');
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    /*
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {*/
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
      console.log('initWeb3 ...');
    //}

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('TutorialToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var TutorialTokenArtifact = data;

      App.contracts.TutorialToken = TruffleContract(TutorialTokenArtifact);

      console.log(TutorialTokenArtifact.contractName);
      // Set the provider for our contract.
      App.contracts.TutorialToken.setProvider(App.web3Provider);
      
      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {

    //var subscription =web3.eth.subscribe('newBlockHeaders', function(error, result){
    //    if (!error)
    //        console.log(result);
    //});

    $(document).on('click', '#transferButton', App.handleTransfer);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' MC to ' + toAddress);

    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;
        
        return tutorialTokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');

    var tutorialTokenInstance;
    var tokenName;
    var tokenDecimals;
    var tokenSymbol;
    var coinbase = web3.eth.coinbase;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      //console.log(accounts);
      var account = accounts[0];

      console.log(web3.eth.defaultAccount);
      //> undefined

      // set the default account
      //web3.eth.defaultAccount = 'accounts[2]';
      
      console.log(coinbase);
      console.log(accounts[2]);
      console.log(web3.eth.getBalance(accounts[2]).toNumber());
      console.log(web3.fromWei(web3.eth.getBalance(accounts[2]).toNumber(),"ether"));

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;
        //console.log(tutorialTokenInstance);
        
        console.log("Current Contract Address");
        console.log(instance.address);
        console.log(App.contracts.TutorialToken.address);

        console.log("defaultBlock");
        console.log(web3.eth.defaultBlock);
        console.log(web3.eth.blockNumber);

        App.debugTransactionBlock(1);
        App.debugTransactionBlock(2);
        App.debugTransactionBlock(3);
        App.debugTransactionBlock(4);
        App.debugTransactionBlock(5);
        App.debugTransactionBlock(6);

        return tutorialTokenInstance.name();
      }).then(function (result) {
        tokenName = result;
        console.log(tokenName);
        return tutorialTokenInstance.decimals();
      }).then(function (result) {
        tokenDecimals = result.c[0];
        console.log(tokenDecimals);
        return tutorialTokenInstance.symbol();
      }).then(function(result) {
        tokenSymbol = result;
        console.log(tokenSymbol);

        return tutorialTokenInstance.balanceOf(account);
      }).then(function(result) {
        //balance = result.c[0];
        balance = result.toNumber();
        //balance / tokenDecimals 
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  debugTransactionBlock : function(blockNumber) {
    console.log("debugTransactionBlock.." + blockNumber);

    var transactionCount = web3.eth.getBlockTransactionCount(blockNumber);

      console.log(transactionCount);
      for (i = 0; i < transactionCount; i++) {
        console.log("blockNumber: " + blockNumber + " Count: " + i);

        var tranHash = web3.eth.getTransactionFromBlock(blockNumber,i).hash;
        console.log("TX HASH: " + tranHash);
        
        //console.log(web3.eth.getTransactionReceipt(tranHash));
        var tranReceipt = web3.eth.getTransactionReceipt(tranHash);
        console.log("transactionIndex: " + tranReceipt.transactionIndex);

        console.log("from: " + tranReceipt.from);
        //console.log("to: " + tran.to);
        //console.log("contractAddress: " + tran.contractAddress);

        if (!tranReceipt.contractAddress) {
          var tran = web3.eth.getTransaction(tranHash);
          //console.log("nonce : " + tran.nonce );
          //console.log("blockHash : " + tran.blockHash );

          console.log("to: " + tran.to);
          console.log("value: " + tran.value);
          console.log("gasPrice: " + tran.gasPrice);
          console.log("gas: " + tran.gas);
          console.log("to: " + tranReceipt.to);

        } else {
          console.log("contractAddress: " + tranReceipt.contractAddress);
        }
        console.log("gasUsed: " + tranReceipt.gasUsed);

        var block = web3.eth.getBlock(blockNumber);

        console.log(block);
  
      //  console.log(web3.eth.getBlockTransactionCount(2));
        //console.log(web3.eth.getTransactionFromBlock(2,0));
      //  console.log(web3.eth.getTransactionFromBlock(2,0).hash);
  
      //  console.log(web3.eth.getTransactionReceipt(web3.eth.getTransactionFromBlock(2,0).hash));
      }
      //console.log(web3.eth.getTransactionFromBlock(1,0));
    
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
