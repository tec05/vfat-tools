$(function() {
consoleInit(main)
});

const SENPAI_POOL_ABI = [{"inputs":[{"internalType":"address","name":"_LPToken","type":"address"},{"internalType":"address","name":"_OHMToken","type":"address"},{"internalType":"address","name":"_rewardPool","type":"address"},{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"},{"internalType":"uint256","name":"_blocksToWait","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_blocksRewarded","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_amountRewarded","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_time","type":"uint256"}],"name":"PoolUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"_rewardsClaimed","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_time","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_totalStaked","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_time","type":"uint256"}],"name":"StakeCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_previous","type":"address"},{"indexed":false,"internalType":"address","name":"_next","type":"address"},{"indexed":false,"internalType":"uint256","name":"_time","type":"uint256"}],"name":"TransferredOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_time","type":"uint256"}],"name":"WithdrawCompleted","type":"event"},{"inputs":[],"name":"LPToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"OHMToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accOHMPerShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_staker","type":"address"}],"name":"getUserBalance","outputs":[{"internalType":"uint256","name":"_amountStaked","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastRewardBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_staker","type":"address"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rewardPool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rewardPerBlock","type":"uint256"}],"name":"setRewardPerBlock","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"stakeLP","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"transferOwnership","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unstakeLP","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"updatePool","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userDetails","outputs":[{"internalType":"uint256","name":"_LPDeposited","type":"uint256"},{"internalType":"uint256","name":"_rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"}]

async function main() {
    const App = await init_ethers();

    _print(`Initialized ${App.YOUR_ADDRESS}\n`);
    _print("Reading smart contracts...\n");

    const tokens = {}, prices = {}
    const SENPAI_ADDR = "0xaC3a4aF1778203c8B651dAfA73cEd5b79c80F239"
    const SENPAI_POOL_ADDR = "0x685d346BA41F9bb8eeD75029EC5EAf5B4472aD17";
    const senpai = await getToken(App, SENPAI_ADDR, SENPAI_POOL_ADDR)
    const rewardTokenTicker = "SENPAI";
    const SENPAI_POOL = new ethcall.Contract(SENPAI_POOL_ADDR, SENPAI_POOL_ABI);
    const [senpaiPerBlock, lpToken, [userBalance, userEarned]] =
        await App.ethcallProvider.all([SENPAI_POOL.rewardPerBlock(), SENPAI_POOL.LPToken(),
          SENPAI_POOL.userDetails(App.YOUR_ADDRESS), SENPAI_POOL.totalStaked()]);
    const pool = await getToken(App, lpToken, SENPAI_POOL_ADDR);
    const newTokenAddresses = [...pool.tokens, SENPAI_ADDR]
    await getNewPricesAndTokens(App, tokens, prices, newTokenAddresses, SENPAI_POOL_ADDR);
    const poolPrices = getPoolPrices(tokens, prices, pool);
    const rewardsPerWeek = senpaiPerBlock / 10 ** senpai.decimals * 604800 / 13.5;
    poolPrices.print_price();
    const rewardPrice = getParameterCaseInsensitive(prices, SENPAI_ADDR).usd;
    const userStaked = userBalance / 10 ** pool.decimals;
    printAPR("SENPAI", rewardPrice, rewardsPerWeek, poolPrices.stakeTokenTicker,
        poolPrices.staked_tvl, userStaked, poolPrices.price, 4);
    const approveAndStake = async function() {
        return senpaiPoolContract_stake(App, SENPAI_POOL_ABI, SENPAI_POOL_ADDR, lpToken)
    }
    const unstake = async function() {
        return senpaiPoolContract_unstake(App, SENPAI_POOL_ABI, SENPAI_POOL_ADDR)
    }
    const claim = async function() {
        return senpaiPoolContract_claim(App, SENPAI_POOL_ABI, SENPAI_POOL_ADDR)
    }
    const pendingRewardTokens = userEarned / 10 ** senpai.decimals;
    _print_link(`Stake ${pool.unstaked.toFixed(4)} ${poolPrices.stakeTokenTicker}`, approveAndStake)
    _print_link(`Unstake ${userStaked.toFixed(4)} ${poolPrices.stakeTokenTicker}`, unstake)
    _print_link(`Claim ${pendingRewardTokens.toFixed(4)} ${rewardTokenTicker} ($${formatMoney(pendingRewardTokens*rewardPrice)})`, claim)
    hideLoading();
  }


const senpaiPoolContract_stake = async function(App, senpaiPoolAbi, senpaiPoolAddress, lpTokenAddress) {
    const signer = App.provider.getSigner()

    const STAKING_TOKEN = new ethers.Contract(lpTokenAddress, ERC20_ABI, signer)
    const SENPAI_POOL_CONTRACT = new ethers.Contract(senpaiPoolAddress, senpaiPoolAbi, signer)

    const currentTokens = await STAKING_TOKEN.balanceOf(App.YOUR_ADDRESS)
    const allowedTokens = await STAKING_TOKEN.allowance(App.YOUR_ADDRESS, senpaiPoolAddress)

    let allow = Promise.resolve()

    if (allowedTokens / 1 < currentTokens / 1) {
      showLoading()
      allow = STAKING_TOKEN.approve(senpaiPoolAddress, ethers.constants.MaxUint256)
        .then(function(t) {
          return App.provider.waitForTransaction(t.hash)
        })
        .catch(function() {
          hideLoading()
          alert('Try resetting your approval to 0 first')
        })
    }

    if (currentTokens / 1 > 0) {
      showLoading()
      allow
        .then(async function() {
          SENPAI_POOL_CONTRACT.stakeLP(currentTokens, {gasLimit: 500000})
            .then(function(t) {
              App.provider.waitForTransaction(t.hash).then(function() {
                hideLoading()
              })
            })
            .catch(function() {
              hideLoading()
              _print('Something went wrong.')
            })
        })
        .catch(function() {
          hideLoading()
          _print('Something went wrong.')
        })
    } else {
      alert('You have no tokens to stake!!')
    }
  }

  const senpaiPoolContract_unstake = async function(App, senpaiPoolAbi, senpaiPoolAddress) {
    const signer = App.provider.getSigner()
    const SENPAI_POOL_CONTRACT = new ethers.Contract(senpaiPoolAddress, senpaiPoolAbi, signer)

    const currentStakedAmount = await SENPAI_POOL_CONTRACT.getUserBalance(App.YOUR_ADDRESS)

    if (currentStakedAmount > 0) {
      showLoading()
      SENPAI_POOL_CONTRACT.unstakeLP({gasLimit: 500000})
        .then(function(t) {
          return App.provider.waitForTransaction(t.hash)
        })
        .catch(function() {
          hideLoading()
        })
    }
  }

  const senpaiPoolContract_claim = async function(App, senpaiPoolAbi, senpaiPoolAddress) {
    const signer = App.provider.getSigner()

    const SENPAI_POOL_CONTRACT = new ethers.Contract(senpaiPoolAddress, senpaiPoolAbi, signer)

    const currentEarnedAmount = await SENPAI_POOL_CONTRACT.pendingRewards(App.YOUR_ADDRESS)

    if (currentEarnedAmount > 0) {
      showLoading()
      SENPAI_POOL_CONTRACT.claimRewards({gasLimit: 500000})
        .then(function(t) {
          return App.provider.waitForTransaction(t.hash)
        })
        .catch(function() {
          hideLoading()
        })
    }
  }


  const senpaiDaoContract_stake = async function(App, senpaiDaoAbi, senpaiDaoAddress, senpaiAddress) {
      const signer = App.provider.getSigner()

      const STAKING_TOKEN = new ethers.Contract(senpaiAddress, ERC20_ABI, signer)
      const SENPAI_DAO_CONTRACT = new ethers.Contract(senpaiDaoAddress, senpaiDaoAbi, signer)

      const currentTokens = await STAKING_TOKEN.balanceOf(App.YOUR_ADDRESS)
      const allowedTokens = await STAKING_TOKEN.allowance(App.YOUR_ADDRESS, senpaiDaoAddress)

      let allow = Promise.resolve()

      if (allowedTokens / 1 < currentTokens / 1) {
        showLoading()
        allow = STAKING_TOKEN.approve(senpaiDaoAddress, ethers.constants.MaxUint256)
          .then(function(t) {
            return App.provider.waitForTransaction(t.hash)
          })
          .catch(function() {
            hideLoading()
            alert('Try resetting your approval to 0 first')
          })
      }

      if (currentTokens / 1 > 0) {
        showLoading()
        allow
          .then(async function() {
            SENPAI_DAO_CONTRACT.stakeSENPAI(currentTokens, {gasLimit: 500000})
              .then(function(t) {
                App.provider.waitForTransaction(t.hash).then(function() {
                  hideLoading()
                })
              })
              .catch(function() {
                hideLoading()
                _print('Something went wrong.')
              })
          })
          .catch(function() {
            hideLoading()
            _print('Something went wrong.')
          })
      } else {
        alert('You have no tokens to stake!!')
      }
    }

    const senpaiDaoContract_unstake = async function(App, senpaiDaoAbi, senpaiDaoAddress) {
      const signer = App.provider.getSigner()
      const SENPAI_DAO_CONTRACT = new ethers.Contract(senpaiDaoAddress, senpaiDaoAbi, signer)

      const currentStakedAmount = await SENPAI_DAO_CONTRACT.getUserBalance(App.YOUR_ADDRESS)

      if (currentStakedAmount > 0) {
        showLoading()
        SENPAI_DAO_CONTRACT.unstakeSENPAI({gasLimit: 500000})
          .then(function(t) {
            return App.provider.waitForTransaction(t.hash)
          })
          .catch(function() {
            hideLoading()
          })
      }
    }

    const senpaiDaoContract_claim = async function(App, senpaiDaoAbi, senpaiDaoAddress) {
      const signer = App.provider.getSigner()

      const SENPAI_DAO_CONTRACT = new ethers.Contract(senpaiDaoAddress, senpaiDaoAbi, signer)

      const currentEarnedAmount = await SENPAI_DAO_CONTRACT.pendingRewards(App.YOUR_ADDRESS)

      if (currentEarnedAmount > 0) {
        showLoading()
        SENPAI_DAO_CONTRACT.claimRewards({gasLimit: 500000})
          .then(function(t) {
            return App.provider.waitForTransaction(t.hash)
          })
          .catch(function() {
            hideLoading()
          })
      }
    }
