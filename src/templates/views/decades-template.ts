module JSDatepicker.templates {
    export const decades: ITemplate = {
        config: {
            name: "decades",
            step: { unit: "y", count: 100 },
            headerFormat: "YYYY"
        },
        template: `
            <%
                function renderDecades(){
                    var amount = template.config.step.count / 2;

                    var t = { 
                        date: options.date,
                        end: moment(date).add(amount, "Y"),
                        start: moment(date).add(-(amount), "Y"),
                        next: null,
                        current: null,
                        today: moment()
                    };
    
                    t.current = moment(t.start);
    
                    while(t.current < t.end) {
                        var item = {
                            value: t.current.year(),
                            classes: ["t-item", "t-event", "t-decade"]
                        };
    
                        t.next = moment(t.current).add(10, "y");
    
                        if(t.date.isBetween(t.current, t.next, "Y", "[]")) item.classes.push("active");
                        if(t.today.isBetween(t.current, t.next, "Y", "[]")) item.classes.push("t-today");
                        w('<div class="<%=item.classes.join(" ")%>"><%=item.value +' - '+ t.next.year()%></div>');
                        t.current = t.next.add(1, "y");
                    }
                }
            %>
            <div class="t-decades">
            <% 
                renderDecades();
            %>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const step = this.config.step;
            const picker = instance.picker;
            if (!step || !picker) return;

            const date = instance.date;
            const format = this.config.headerFormat;
            const amount = step.count / 2;
            const range = {
                start: moment(date).add(-(amount), step.unit).format(format),
                end: moment(date).add(amount + 9, step.unit).format(format)
            };

            picker.find(".t-nav.t-title").text(`${range.start} - ${range.end}`);

            const items = element.find(".t-event");
            items.on("click", (e) => {
                let value = 0;

                $(e.target).text().split(" - ").forEach(item => {
                    value += parseInt(item);
                });

                instance.date.year(value / 2);
            });
        }
    }
}