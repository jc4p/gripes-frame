import * as frame from '@farcaster/frame-sdk'

export async function initializeFrame() {
  let user = (await frame.sdk.context).user

  if (user.user) {
    user = user.user
  }

  if (!user || !user.fid) {
    // most likely not in a frame
    return
  }

  window.userFid = user.fid;

  // switch to Base if we're not already on it
  await frame.sdk.wallet.ethProvider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x2105' }] // Base mainnet chainId
  });

  // Call the ready function to remove your splash screen when in a frame
  await frame.sdk.actions.ready();
} 