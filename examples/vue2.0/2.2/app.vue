
<script>
const grids = new Array(8).fill(1).map((_, r) => {
  return new Array(8).fill(1).map((_, c) => {
    return {
      key: `key-${r * 8 + c}`,
      ok: false
    }
  })
})
console.log('grids', grids)
export default {
  name: 'affairSelect',
  data () {
    return {
      grids
    }
  },
  render () {
    return (
      <div>
        <div class="title">八皇后问题</div>
        <div class="grid">
          {
            this.grids.map((row, index) => {
              return (<div class="row" key={index}>
                {row.map((cell, i) => {
                  return <div class="cell" key={cell.key}>
                    {
                      cell.ok ? <div>Q</div> : ''
                    }

                  </div>
                })}
              </div>)
            })}
        </div>

      </div>
    )
  }
}
</script>

<style scoped></style>