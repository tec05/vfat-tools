
$(function() {
  consoleInit(main)
    });

  const YUZU_CHEF_ABI = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_yuzu","internalType":"contract YUZUToken"},{"type":"address","name":"_yuzukeeper","internalType":"contract IYuzuKeeper"},{"type":"uint256","name":"_yuzuPerBlock","internalType":"uint256"},{"type":"uint256","name":"_startBlock","internalType":"uint256"},{"type":"uint256","name":"_blockNumberOfHalfAttenuationCycle","internalType":"uint256"}]},{"type":"event","name":"Deposit","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"pid","internalType":"uint256","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"EmergencyWithdraw","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"pid","internalType":"uint256","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","internalType":"address","indexed":true},{"type":"address","name":"newOwner","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Withdraw","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"pid","internalType":"uint256","indexed":true},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"add","inputs":[{"type":"uint256","name":"_allocPoint","internalType":"uint256"},{"type":"address","name":"_lpToken","internalType":"contract IERC20"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"blockNumberOfHalfAttenuationCycle","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"deposit","inputs":[{"type":"uint256","name":"_pid","internalType":"uint256"},{"type":"uint256","name":"_amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"emergencyWithdraw","inputs":[{"type":"uint256","name":"_pid","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getYuzuBetweenBlocks","inputs":[{"type":"uint256","name":"_from","internalType":"uint256"},{"type":"uint256","name":"_to","internalType":"uint256"}]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getYuzuFromStartblock","inputs":[{"type":"uint256","name":"_startBlock","internalType":"uint256"},{"type":"uint256","name":"_blockNumberOfHalfAttenuationCycle","internalType":"uint256"},{"type":"uint256","name":"_yuzuPerBlock","internalType":"uint256"},{"type":"uint256","name":"_to","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"lpTokenRecorder","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"massUpdatePools","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"pendingYuzu","inputs":[{"type":"uint256","name":"_pid","internalType":"uint256"},{"type":"address","name":"_user","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"lpToken","internalType":"contract IERC20"},{"type":"uint256","name":"allocPoint","internalType":"uint256"},{"type":"uint256","name":"lastRewardBlock","internalType":"uint256"},{"type":"uint256","name":"accYuzuPerShare","internalType":"uint256"}],"name":"poolInfo","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"poolLength","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"renounceOwnership","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"set","inputs":[{"type":"uint256","name":"_pid","internalType":"uint256"},{"type":"uint256","name":"_allocPoint","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"startBlock","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalAllocPoint","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updatePool","inputs":[{"type":"uint256","name":"_pid","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"amount","internalType":"uint256"},{"type":"uint256","name":"rewardDebt","internalType":"uint256"}],"name":"userInfo","inputs":[{"type":"uint256","name":"","internalType":"uint256"},{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"_pid","internalType":"uint256"},{"type":"uint256","name":"_amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract YUZUToken"}],"name":"yuzu","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"yuzuPerBlock","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IYuzuKeeper"}],"name":"yuzukeeper","inputs":[]}]

  async function main() {
      const App = await init_ethers();

      _print(`Initialized ${App.YOUR_ADDRESS}\n`);
      _print("Reading smart contracts...\n");

     const YUZU_CHEF_ADDR = "0xB759803Ee7087559EB601a4939c2d5da7668385a";

     const rewardTokenTicker = "YUZU";
     const YUZU_CHEF = new ethers.Contract(YUZU_CHEF_ADDR, YUZU_CHEF_ABI, App.provider);
     const currentBlock = await App.provider.getBlockNumber();
     const startBlock = await YUZU_CHEF.startBlock();
     let rewardsPerWeek = 0

     const blocksPerSeconds = await getAverageBlockTime(App);

     if(currentBlock < startBlock){
      _print(`Rewards start at block ${startBlock}\n`);
     }else{
      rewardsPerWeek = await YUZU_CHEF.yuzuPerBlock() /1e18 * 604800 / blocksPerSeconds;
     }

      const tokens = {};
      const prices = await getEmeraldPrices();

      await loadEmeraldChefContract(App, tokens, prices, YUZU_CHEF, YUZU_CHEF_ADDR, YUZU_CHEF_ABI, rewardTokenTicker,
        "yuzu", null, rewardsPerWeek, "pendingYuzu");

      hideLoading();
    }
