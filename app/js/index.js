/* globals web3 fetch */
import $ from 'jquery';
import EmbarkJS from 'Embark/EmbarkJS';
import Rewards from 'Embark/contracts/Rewards';

const ipfsApiGateway = 'https://ipfs.infura.io:5001';
const ipfsLiveGateway = 'https://cloudflare-ipfs.com';

const netInfo = { // TODO limit this to main network on deploy
  1: { desc: 'Main Ethereum Network', explorer: 'https://etherscan.io', opensea: 'https://opensea.io/assets' },
  3: { desc: 'Ropsten Test Network', explorer: 'https://ropsten.etherscan.io', opensea: '' },
  4: { desc: 'Rinkeby Test Network', explorer: 'https://rinkeby.etherscan.io', opensea: 'https://rinkeby.opensea.io/assets' },
  42: { desc: 'Kovan Test Network', explorer: 'https://kovan.etherscan.io', opensea: '' },
  1337: { desc: 'Local Network', explorer: '', opensea: '' }
};

function error (err) {
  $('#div_error').removeClass('w3-hide');
  $('#div_error #text_description').text(err);
}

async function pinIpfs (gateway, hash) {
  if (gateway === null) return;
  const call = `${gateway}/api/v0/pin/add?arg=/ipfs/${hash}&recursive=true`;
  const response = await fetch(call);
  if (!response.ok) throw new Error('pinIpfs HTTP error, status = ' + response.status);
  const json = await response.text();
  const hashRsp = JSON.parse(json)['Pins'];
  return (hashRsp) ? hashRsp[0] === hash : false;
}

window.addEventListener('load', async () => {
  try {
    if (!window.ethereum && !window.web3) throw new Error('Non-Ethereum browser detected.');
    if (window.ethereum) await EmbarkJS.enableEthereum();

    EmbarkJS.onReady(async (err) => {
      try {
        // ** Check blockchain
        if (err) throw new Error(err);
        console.log('blockchain OK');
        // ** Check storage
        const result = await EmbarkJS.Storage.isAvailable();
        if (!result) throw new Error('Storage not available.');
        console.log('storage OK');

        // ** Main
        var curContract = Rewards;
        const netid = await web3.eth.net.getId();
        if (netInfo[netid] === undefined) throw new Error(`Incompatable network for this dapp. Please choose ${netInfo[Object.keys(netInfo)[0]].desc}.`);

        // Get current contract address
        const urlParams = new URLSearchParams(window.location.search);
        const ipfsApiGtwyBkupHost = urlParams.get('ipfs');
        const ipfsApiGtwyBkup = (ipfsApiGtwyBkupHost === null) ? null : (new URL(`https://${ipfsApiGtwyBkupHost}`)).toString().slice(0, -1);
        const contractAddr = urlParams.get('contract');
        if (web3.utils.isAddress(contractAddr)) {
          curContract = new EmbarkJS.Blockchain.Contract({
            abi: Rewards.options.jsonInterface,
            address: contractAddr,
            web3: web3
          });
        } else {
          // Deploy new contract
          $('#div_deploy').removeClass('w3-hide');
          $('#div_deploy #text_network').text(netInfo[netid].desc);
          $('#div_deploy #button_deploy').click(async function () {
            try {
              $('#div_error').addClass('w3-hide');
              $('#modal_progress').addClass('w3-show');
              const inputname = $('#div_deploy #input_name').val(); if (inputname.length > 32) throw new Error('Contract name too long.');
              const inputsymbol = $('#div_deploy #input_symbol').val(); if (inputsymbol.length > 8) throw new Error('Contract symbol too long.');
              const inputcap = web3.utils.toBN($('#div_deploy #input_cap').val()).toString();
              curContract = await Rewards.deploy({ arguments: [inputcap, inputname, inputsymbol], data: Rewards.options.data }).send();
              window.location.search = 'contract=' + encodeURI(curContract.options.address);
            } catch (err) { error(err); }
            $('#modal_progress').removeClass('w3-show');
          });
          return;
        }
        $('#div_mint #hdr').click(async function () { $('#div_mint #span_content').toggleClass('w3-hide'); });
        $('#div_list_id #hdr').click(async function () { $('#div_list_id #span_content').toggleClass('w3-hide'); });
        $('#div_list_owner #hdr').click(async function () { $('#div_list_owner #span_content').toggleClass('w3-hide'); });
        $('#div_list #hdr').click(async function () { $('#div_list #span_content').toggleClass('w3-hide'); });

        // Contract Info
        const name = await curContract.methods.name().call();
        $('#div_info #text_name').text(name);
        const symbol = await curContract.methods.symbol().call();
        $('#div_info #text_symbol').text(symbol);
        $('#div_info #text_network').text(netInfo[netid].desc);
        $('#div_info #text_address').text(curContract.options.address);
        $('#div_info #text_details').html(`<a href="${netInfo[netid].explorer}/address/${curContract.options.address}" target="_blank">View Contract Details</a>`);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length < 1) throw new Error('No Ethereum accounts available.');
        const minter = await curContract.methods.isMinter(accounts[0]).call();
        $('#div_info').append(`<p>Using ETH Wallet Account: ${accounts[0]} <span class="w3-text-grey">Minter Role? ${minter}</span></p>`);
        const curId = await curContract.methods.tokenId().call();
        const cap = await curContract.methods.maxSupply().call();
        $('#div_info').append(`<p><b id="text_curid">${curId}</b> of <b>${cap}</b> minted</p>`);

        // Mint NFT
        $('#div_mint #button_execute').click(async function () {
          try {
            $('#div_error').addClass('w3-hide');
            $('#modal_progress').addClass('w3-show');
            $('#div_mint #span_content #d').remove();
            const owner = $('#div_mint #input_address').val();
            if (!web3.utils.isAddress(owner)) throw new Error('Address is not a correctly formated Ethereum address.');
            let json = {};
            const inputimageurl = $('#div_mint #input_image_url');
            if (inputimageurl.prop('files').length > 0) {
              const hash = await EmbarkJS.Storage.uploadFile(inputimageurl);
              await pinIpfs(ipfsApiGateway, hash); await pinIpfs(ipfsApiGtwyBkup, hash);
              json['image_url'] = ipfsLiveGateway + '/ipfs/' + hash;
            }
            const inputname = $('#div_mint #input_name').val(); if (inputname !== '') json['name'] = inputname;
            const inputdescription = $('#div_mint #input_description').val(); if (inputdescription !== '') json['description'] = inputdescription;
            const inputbackgroundcolor = $('#div_mint #input_background_color').val(); if (inputbackgroundcolor !== '') json['background_color'] = inputbackgroundcolor;
            const inputtraits = JSON.parse('[' + $('#div_mint #input_traits').val() + ']'); if (inputtraits.length > 0) json['traits'] = inputtraits;
            const hash = await EmbarkJS.Storage.saveText(JSON.stringify(json));
            await pinIpfs(ipfsApiGateway, hash); await pinIpfs(ipfsApiGtwyBkup, hash);
            const uri = ipfsLiveGateway + '/ipfs/' + hash;
            const receipt = await curContract.methods.mintWithTokenURI(owner, uri).send();
            const id = receipt.events['Transfer'].returnValues.tokenId;
            const item = `<p id="d"><b>NFT</b> | <a href="${uri}" target="_blank">MetaData</a> | <a href="${netInfo[netid].opensea}/${curContract.options.address}/${id}" target="_blank">OpenSea</a>` +
            ` | <a href="${netInfo[netid].explorer}/token/${curContract.options.address}?a=${id}" target="_blank">History</a> | ID[${id}]</p>`;
            $('#div_mint #span_content').append(item);
            const curId = await curContract.methods.tokenId().call();
            $('#div_info #text_curid').text(curId);
          } catch (err) { error(err); }
          $('#modal_progress').removeClass('w3-show');
        });

        // Get an NFT by ID
        $('#div_list_id #button_query').click(async function () {
          try {
            $('#div_error').addClass('w3-hide');
            $('#div_list_id #span_content #d').remove();
            const id = web3.utils.toBN($('#div_list_id #input_id').val()).toString();
            const owner = await curContract.methods.ownerOf(id).call();
            const uri = await curContract.methods.tokenURI(id).call();
            const item = `<p id="d"><b>NFT</b> | <a href="${uri}" target="_blank">MetaData</a> | <a href="${netInfo[netid].opensea}/${curContract.options.address}/${id}" target="_blank">OpenSea</a>` +
            ` | <a href="${netInfo[netid].explorer}/token/${curContract.options.address}?a=${id}" target="_blank">History</a> | ID[${id}] Owner[${owner}]</p>`;
            $('#div_list_id #span_content').append(item);
          } catch (err) { error(err); }
        });

        // List NFTs owned by address
        $('#div_list_owner #button_list').click(async function () {
          try {
            $('#div_error').addClass('w3-hide');
            $('#div_list_owner #span_content #d').remove();
            const owner = $('#div_list_owner #input_address').val();
            if (!web3.utils.isAddress(owner)) throw new Error('Address is not a correctly formated Ethereum address.');
            const count = await curContract.methods.balanceOf(owner).call();
            for (let i = 0; i < count; i++) {
              const id = await curContract.methods.tokenOfOwnerByIndex(owner, i).call();
              const uri = await curContract.methods.tokenURI(id).call();
              const item = `<p id="d"><b>NFT</b> | <a href="${uri}" target="_blank">MetaData</a> | <a href="${netInfo[netid].opensea}/${curContract.options.address}/${id}" target="_blank">OpenSea</a>` +
              ` | <a href="${netInfo[netid].explorer}/token/${curContract.options.address}?a=${id}" target="_blank">History</a> | ID[${id}]</p>`;
              $('#div_list_owner #span_content').append(item);
            }
          } catch (err) { error(err); }
        });

        // List all minted NFTs
        $('#div_list #button_list').click(async function () {
          try {
            $('#div_error').addClass('w3-hide');
            $('#div_list #span_content #d').remove();
            const count = await curContract.methods.totalSupply().call();
            for (let i = 0; i < count; i++) {
              const id = await curContract.methods.tokenByIndex(i).call();
              const owner = await curContract.methods.ownerOf(id).call();
              const uri = await curContract.methods.tokenURI(id).call();
              const item = `<p id="d"><b>NFT</b> | <a href="${uri}" target="_blank">MetaData</a> | <a href="${netInfo[netid].opensea}/${curContract.options.address}/${id}" target="_blank">OpenSea</a>` +
              ` | <a href="${netInfo[netid].explorer}/token/${curContract.options.address}?a=${id}" target="_blank">History</a> | ID[${id}] Owner[${owner}]</p>`;
              $('#div_list #span_content').append(item);
            }
          } catch (err) { error(err); }
        });
        $('#span_admin').removeClass('w3-hide');
      } catch (err) { error(err); }
    });
  } catch (err) { error(err); }
});
