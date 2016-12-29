#r "E:\WORK\TagsMDA\SourceCode\Web\Libaray.Bin\Modules\Report\X1.BLL.Module.Report.DAL.Model.dll"
using System.Threading.Tasks;


public class Startup
{
    public async Task<object> Invoke(object input)
    {
        X1.BLL.Module.Report.DAL.Model.StatusDuration st = new X1.BLL.Module.Report.DAL.Model.StatusDuration();
        st.DURATION = int.Parse(input.ToString());
        return st;
    }
}
